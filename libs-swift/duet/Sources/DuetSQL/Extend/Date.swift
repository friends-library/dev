import XCore

public extension Date {
  var postgresTimestampString: String {
    isoString
  }
}
