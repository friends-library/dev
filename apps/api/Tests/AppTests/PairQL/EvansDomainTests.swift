import DuetSQL
import XCTest
import XExpect

@testable import App

final class EvansDomainTests: AppTestCase {
  func testSubscribingToNarrowPathHappyPath() async throws {
    let token = UUID()
    Current.uuid = { token }

    let email = "you@example.com".random

    let output = try await SubscribeToNarrowPath.resolve(
      with: .init(email: .init(rawValue: email), lang: .en, nonFriendQuotesOptIn: false),
      in: .mock
    )

    expect(output).toEqual(.success)
    expect(sent.emails.count).toEqual(1)
    expect(sent.emails[0].text).toContain("confirm-email/en/\(token.lowercased)")

    let subscriber = try await NPSubscriber.query()
      .where(.email == email)
      .first()

    expect(subscriber.email).toEqual(email)
    expect(subscriber.confirmationToken).toEqual(token)

    try app.test(.GET, "confirm-email/en/\(token.lowercased)") { res in
      expect(subscriber.confirmationToken).toBeNil()
      expect(res.status).toEqual(.temporaryRedirect)
      expect(res.headers.first(name: .location))
        .toEqual("\(Env.WEBSITE_URL_EN)/success")
    }
  }

  func testInvalidTokenRedirectsToFailurePage() async throws {
    try app.test(.GET, "confirm-email/es/ham-sandwich") { res in
      expect(res.status).toEqual(.temporaryRedirect)
      expect(res.headers.first(name: .location))
        .toEqual("\(Env.WEBSITE_URL_ES)/fracaso")
    }
  }

  func testTokenNotFoundError() async throws {
    try app.test(.GET, "confirm-email/en/\(UUID())") { res in
      expect(res.status).toEqual(.temporaryRedirect)
      expect(res.headers.first(name: .location))
        .toEqual("\(Env.WEBSITE_URL_EN)/failure")
    }
  }
}
