import DuetSQL
import XCTest
import XExpect

@testable import App

final class EvansDomainTests: AppTestCase {
  func testSubscribingAndUnsubscribingHappyPath() async throws {
    let token = UUID()
    Current.uuid = { token }

    let email = "you@example.com".random

    let output = try await SubscribeToNarrowPath.resolve(
      with: .init(email: .init(rawValue: email), lang: .en, mixedQuotes: false),
      in: .mock
    )

    expect(output).toEqual(.success)
    expect(sent.emails.count).toEqual(1)
    expect(sent.emails[0].text).toContain("confirm-email/en/\(token.lowercased)")

    let subscriber = try await NPSubscriber.query()
      .where(.email == email)
      .first()

    expect(subscriber.email).toEqual(email)
    expect(subscriber.pendingConfirmationToken).toEqual(token)
  }
}
