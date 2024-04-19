import Fluent

extension Token {
  enum M4 {
    static let tableName = "tokens"
    nonisolated(unsafe) static let value = FieldKey("value")
    nonisolated(unsafe) static let description = FieldKey("description")
  }
}
