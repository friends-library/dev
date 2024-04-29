import Fluent

extension Document {
  enum M14 {
    static let tableName = "documents"
    static let friendId = FieldKey("friend_id")
    static let altLanguageId = FieldKey("alt_language_id")
    static let title = FieldKey("title")
    static let slug = FieldKey("slug")
    static let filename = FieldKey("filename")
    static let published = FieldKey("published")
    static let description = FieldKey("description")
    static let partialDescription = FieldKey("partial_description")
    static let featuredDescription = FieldKey("featured_description")
    static let originalTitle = FieldKey("original_title")
    static let incomplete = FieldKey("incomplete")
  }
}
