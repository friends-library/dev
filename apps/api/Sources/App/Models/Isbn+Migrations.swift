import Fluent

extension Isbn {
  enum M19 {
    static let tableName = "isbns"
    static let code = FieldKey("code")
    static let editionId = FieldKey("edition_id")
  }
}
