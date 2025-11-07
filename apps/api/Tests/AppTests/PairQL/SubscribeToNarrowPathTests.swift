import DuetSQL
import XCTest
import XExpect

@testable import App

final class SubscribeToNarrowPathTests: AppTestCase, @unchecked Sendable {
  func testUnsubscribeWebhook() async throws {
    let subscriber = try await Current.db.create(NPSubscriber(
      token: nil,
      mixedQuotes: true,
      email: "bob@\(Int.random)bob.com",
      lang: .en,
    ))
    expect(subscriber.unsubscribedAt).toBeNil()

    // https://postmarkapp.com/developer/webhooks/subscription-change-webhook
    let json = """
    {
      "RecordType":"SubscriptionChange",
      "MessageID": "883953f4-6105-42a2-a16a-77a8eac79483",
      "ServerID":123456,
      "MessageStream": "narrow-path-en",
      "ChangedAt": "2020-02-01T10:53:34.416071Z",
      "Recipient": "\(subscriber.email)",
      "Origin": "Recipient",
      "SuppressSending": true,
      "SuppressionReason": "ManualSupression",
      "Tag": "my-tag",
      "Metadata": {
         "example": "value",
         "example_2": "value"
      }
    }
    """

    let path = "postmark/webhook/\(Env.POSTMARK_WEBHOOK_SLUG)"
    try await app.test(.POST, path, body: .init(string: json), afterResponse: { res in
      let retrieved = try await Current.db.find(subscriber.id)
      expect(retrieved.unsubscribedAt).not.toBeNil()
    })
  }

  func testEnglishSubscribingHappyPath() async throws {
    var quote = NPQuote.mock
    quote.lang = .en
    try await quote.create()

    let token = UUID()
    Current.uuid = { token }
    Current.cloudflareClient.verifyTurnstileToken = { input in
      if input == "turnstile-token-value" {
        .success
      } else {
        .failure(errorCodes: [], messages: nil)
      }
    }

    let email = "you@example.com".random
    let output = try await SubscribeToNarrowPath.resolve(
      with: .init(
        email: .init(rawValue: email),
        lang: .en,
        mixedQuotes: false,
        turnstileToken: "turnstile-token-value",
      ),
      in: .mock,
    )

    expect(output).toEqual(.success)
    expect(sent.emails.count).toEqual(1)
    expect(sent.emails[0].from).toEqual(EmailBuilder.fromAddress(lang: .en))
    expect(sent.emails[0].body).toContain("confirm-email/en/\(token.lowercased)")

    let subscriber = try await NPSubscriber.query()
      .where(.email == email)
      .first()

    expect(subscriber.email).toEqual(email)
    expect(subscriber.lang).toEqual(.en)
    expect(subscriber.pendingConfirmationToken).toEqual(token)

    try await app.test(.GET, "confirm-email/en/\(token.lowercased)") { res in
      let retrieved = try await NPSubscriber.find(subscriber.id)
      expect(retrieved.pendingConfirmationToken).toBeNil()
      expect(res.status).toEqual(.temporaryRedirect)
      expect(res.headers.first(name: .location))
        .toEqual("\(Env.WEBSITE_URL_EN)/narrow-path/confirm-email/success")

      expect(sent.templateEmails.count).toEqual(1)
      expect(sent.templateEmails[0].to).toEqual(email)
      expect(sent.templateEmails[0].templateAlias).toEqual("narrow-path")
      expect(sent.templateEmails[0].messageStream).toEqual("narrow-path-en")
    }
  }

  func testSpanishSubscribingHappyPath() async throws {
    var quote = NPQuote.mock
    quote.lang = .es
    try await quote.create()

    let token = UUID()
    Current.uuid = { token }
    Current.cloudflareClient.verifyTurnstileToken = { input in
      if input == "turnstile-token-value" {
        .success
      } else {
        .failure(errorCodes: [], messages: nil)
      }
    }

    let email = "tu@examplo.com".random
    let output = try await SubscribeToNarrowPath.resolve(
      with: .init(
        email: .init(rawValue: email),
        lang: .es,
        mixedQuotes: false,
        turnstileToken: "turnstile-token-value",
      ),
      in: .mock,
    )

    expect(output).toEqual(.success)
    expect(sent.emails.count).toEqual(1)
    expect(sent.emails[0].from).toEqual(EmailBuilder.fromAddress(lang: .es))
    expect(sent.emails[0].body).toContain("confirm-email/es/\(token.lowercased)")

    let subscriber = try await NPSubscriber.query()
      .where(.email == email)
      .first()

    expect(subscriber.email).toEqual(email)
    expect(subscriber.lang).toEqual(.es)
    expect(subscriber.pendingConfirmationToken).toEqual(token)

    try await app.test(.GET, "confirm-email/es/\(token.lowercased)") { res in
      let retrieved = try await NPSubscriber.find(subscriber.id)
      expect(retrieved.pendingConfirmationToken).toBeNil()
      expect(res.status).toEqual(.temporaryRedirect)
      expect(res.headers.first(name: .location))
        .toEqual("\(Env.WEBSITE_URL_ES)/camino-estrecho/confirmar-correo/exito")

      expect(sent.templateEmails.count).toEqual(1)
      expect(sent.templateEmails[0].to).toEqual(email)
      expect(sent.templateEmails[0].templateAlias).toEqual("narrow-path")
      expect(sent.templateEmails[0].messageStream).toEqual("narrow-path-es")
    }
  }

  func testInvalidTokenRedirectsToFailurePage() throws {
    try app.test(.GET, "confirm-email/es/ham-sandwich") { res in
      expect(res.status).toEqual(.temporaryRedirect)
      expect(res.headers.first(name: .location))
        .toEqual("\(Env.WEBSITE_URL_ES)/camino-estrecho/confirmar-correo/fallo")
    }
  }

  func testTokenNotFoundError() throws {
    try app.test(.GET, "confirm-email/en/\(UUID())") { res in
      expect(res.status).toEqual(.temporaryRedirect)
      expect(res.headers.first(name: .location))
        .toEqual("\(Env.WEBSITE_URL_EN)/narrow-path/confirm-email/failure")
    }
  }

  func testSpamRejectionFromCloudflareChallenge() async throws {
    var quote = NPQuote.mock
    quote.lang = .en
    try await quote.create()

    let token = UUID()
    Current.uuid = { token }
    Current.cloudflareClient.verifyTurnstileToken = { _ in
      .failure(errorCodes: [], messages: nil)
    }

    try await expectErrorFrom {
      try await SubscribeToNarrowPath.resolve(
        with: .init(
          email: .init(rawValue: "you@example.com"),
          lang: .en,
          mixedQuotes: false,
          turnstileToken: "turnstile-token-value",
        ),
        in: .mock,
      )
    }.toContain("Bad Request")
  }
}
