import Fluent

extension FriendResidence {
  enum M12 {
    static let tableName = "friend_residences"
    nonisolated(unsafe) static let id = FieldKey("id")
    nonisolated(unsafe) static let city = FieldKey("city")
    nonisolated(unsafe) static let region = FieldKey("region")
    nonisolated(unsafe) static let duration = FieldKey("duration")
    nonisolated(unsafe) static let friendId = FieldKey("friend_id")
  }
}
