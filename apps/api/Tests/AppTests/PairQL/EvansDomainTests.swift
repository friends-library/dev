import DuetSQL
import XCTest
import XExpect

@testable import App

final class EvansDomainTests: AppTestCase {
  func testSubscribingToNarrowPath() async throws {
    let token = UUID()
    Current.uuid = { token }

    let email = "you@example.com".random

    let output = try await SubscribeToNarrowPath.resolve(
      with: .init(email: .init(rawValue: email), lang: .en, nonFriendQuotesOptIn: false),
      in: .mock
    )

    expect(output).toEqual(.success)
    expect(sent.emails.count).toEqual(1)
    expect(sent.emails[0].text).toContain("confirm-email/\(token.lowercased)")

    let subscriber = try await NPSubscriber.query()
      .where(.email == email)
      .first()

    expect(subscriber.email).toEqual(email)
    expect(subscriber.confirmationToken).toEqual(token)

    try app.test(.GET, "confirm-email/\(token.lowercased)") { res in
      expect(subscriber.confirmationToken).toBeNil()
      expect(res.status).toEqual(.temporaryRedirect)
      expect(res.headers.first(name: .location))
        .toEqual("https://friendslibrary.com/success") // TODO: lang aware tests for this (not hard coded) (we have env vars for this WEBSITE_URL_<LANG>)
    }
  }
}
