import Fluent

extension Isbn {
  enum M19 {
    static let tableName = "isbns"
    nonisolated(unsafe) static let code = FieldKey("code")
    nonisolated(unsafe) static let editionId = FieldKey("edition_id")
  }
}
