import DuetSQL
import XCTest
import XExpect

@testable import App

final class EvansDomainTests: AppTestCase {
  func testEnglishSubscribingHappyPath() async throws {
    let token = UUID()
    Current.uuid = { token }

    let email = "you@example.com".random
    let output = try await SubscribeToNarrowPath.resolve(
      with: .init(email: .init(rawValue: email), lang: .en, mixedQuotes: false),
      in: .mock
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
    }
  }

  func testSpanishSubscribingHappyPath() async throws {
    let token = UUID()
    Current.uuid = { token }

    let email = "tu@examplo.com".random
    let output = try await SubscribeToNarrowPath.resolve(
      with: .init(email: .init(rawValue: email), lang: .es, mixedQuotes: false),
      in: .mock
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
        .toEqual("\(Env.WEBSITE_URL_ES)/camino-estrecho/confirmar-email/exito")
    }
  }

  func testInvalidTokenRedirectsToFailurePage() async throws {
    try app.test(.GET, "confirm-email/es/ham-sandwich") { res in
      expect(res.status).toEqual(.temporaryRedirect)
      expect(res.headers.first(name: .location))
        .toEqual("\(Env.WEBSITE_URL_ES)/camino-estrecho/confirmar-email/fallo")
    }
  }

  func testTokenNotFoundError() async throws {
    try app.test(.GET, "confirm-email/en/\(UUID())") { res in
      expect(res.status).toEqual(.temporaryRedirect)
      expect(res.headers.first(name: .location))
        .toEqual("\(Env.WEBSITE_URL_EN)/narrow-path/confirm-email/failure")
    }
  }
}
