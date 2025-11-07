import DuetSQL
import Foundation

@testable import App

extension Environment {
  static let mock = Environment(
    uuid: { .mock },
    date: { Date(timeIntervalSince1970: 0) },
    db: ThrowingClient(),
    logger: .null,
    postmarkClient: .mock,
    slackClient: RateLimitedSlackClient { _ in },
    luluClient: .mock,
    stripeClient: .mock,
    ipApiClient: .mock,
    userAgentParser: .mock,
  )
}
