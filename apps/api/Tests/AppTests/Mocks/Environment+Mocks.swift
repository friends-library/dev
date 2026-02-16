import DuetSQL
import Foundation

@testable import App

extension Environment {
  static let mock = Environment(
    db: ThrowingClient(),
    logger: .null,
    postmarkClient: .mock,
  )
}
