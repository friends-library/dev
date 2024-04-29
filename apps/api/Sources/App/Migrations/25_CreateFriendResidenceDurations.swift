import Fluent

struct CreateFriendResidenceDurations: AsyncMigration {
  private typealias M25 = FriendResidenceDuration.M25

  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: CreateFriendResidenceDurations UP")
    try await database.schema(M25.tableName)
      .id()
      .field(
        M25.friendResidenceId,
        .uuid,
        .references(FriendResidence.M12.tableName, .id, onDelete: .cascade)
      )
      .field(M25.start, .int)
      .field(M25.end, .int)
      .field(.createdAt, .datetime)
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: CreateFriendResidenceDurations DOWN")
    try await database.schema(M25.tableName).delete()
  }
}

// extensions

extension FriendResidenceDuration {
  enum M25 {
    static let tableName = "friend_residence_durations"
    static let friendResidenceId = FieldKey("friend_residence_id")
    static let start = FieldKey("start")
    static let end = FieldKey("end")
  }
}
