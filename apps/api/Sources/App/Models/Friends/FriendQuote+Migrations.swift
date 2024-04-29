import Fluent

extension FriendQuote {
  enum M13 {
    static let tableName = "friend_quotes"
    static let friendId = FieldKey("friend_id")
    static let source = FieldKey("source")
    static let text = FieldKey("text")
    static let order = FieldKey("order")
    static let context = FieldKey("context")
  }
}
