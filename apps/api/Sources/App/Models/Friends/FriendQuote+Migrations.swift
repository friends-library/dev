import Fluent

extension FriendQuote {
  enum M13 {
    static let tableName = "friend_quotes"
    nonisolated(unsafe) static let friendId = FieldKey("friend_id")
    nonisolated(unsafe) static let source = FieldKey("source")
    nonisolated(unsafe) static let text = FieldKey("text")
    nonisolated(unsafe) static let order = FieldKey("order")
    nonisolated(unsafe) static let context = FieldKey("context")
  }
}
