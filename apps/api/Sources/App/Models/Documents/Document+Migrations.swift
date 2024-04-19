import Fluent

extension Document {
  enum M14 {
    static let tableName = "documents"
    nonisolated(unsafe) static let friendId = FieldKey("friend_id")
    nonisolated(unsafe) static let altLanguageId = FieldKey("alt_language_id")
    nonisolated(unsafe) static let title = FieldKey("title")
    nonisolated(unsafe) static let slug = FieldKey("slug")
    nonisolated(unsafe) static let filename = FieldKey("filename")
    nonisolated(unsafe) static let published = FieldKey("published")
    nonisolated(unsafe) static let description = FieldKey("description")
    nonisolated(unsafe) static let partialDescription = FieldKey("partial_description")
    nonisolated(unsafe) static let featuredDescription = FieldKey("featured_description")
    nonisolated(unsafe) static let originalTitle = FieldKey("original_title")
    nonisolated(unsafe) static let incomplete = FieldKey("incomplete")
  }
}
