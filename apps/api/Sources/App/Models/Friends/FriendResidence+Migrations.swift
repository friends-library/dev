import Fluent

extension FriendResidence {
  enum M12 {
    static let tableName = "friend_residences"
    static let id = FieldKey("id")
    static let city = FieldKey("city")
    static let region = FieldKey("region")
    static let duration = FieldKey("duration")
    static let friendId = FieldKey("friend_id")
  }
}
