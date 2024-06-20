import Foundation
import Tagged

extension UUID {
  static let mock = UUID("DEADBEEF-DEAD-BEEF-DEAD-DEADBEEFDEAD")!

  public init(_ intValue: Int) {
    self.init(uuidString: "00000000-0000-0000-0000-\(String(format: "%012x", intValue))")!
  }
}

extension UUID: ExpressibleByIntegerLiteral {
  public init(integerLiteral value: Int) {
    self.init(value)
  }
}
