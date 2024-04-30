import Tagged
import XCore

// extension Tagged: RandomEmptyInitializing where RawValue == UUID {
//   public init() {
//     #if DEBUG
//       self.init(rawValue: .new())
//     #else
//       self.init(rawValue: UUID())
//     #endif
//   }
// }

extension Tagged: UUIDStringable where RawValue == UUID {
  public var uuidString: String { rawValue.uuidString }
}

extension Tagged where RawValue == UUID {
  var lowercased: String { rawValue.lowercased }
}
