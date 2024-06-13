import DuetSQL
import Foundation

@testable import App

extension Environment {
  static let mock = Environment(
    uuid: { .mock },
    date: { Date(timeIntervalSince1970: 0) },
    db: ThrowingClient(),
    logger: .null,
    slackClient: RateLimitedSlackClient { _ in },
    luluClient: .mock,
    sendGridClient: .mock,
    stripeClient: .mock,
    ipApiClient: .mock,
    userAgentParser: .mock
  )
}
