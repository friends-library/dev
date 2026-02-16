import Fluent
import Vapor

struct CreateFriendResidences: AsyncMigration {
  private typealias M12 = FriendResidence.M12

  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: CreateFriendResidences UP")
    try await database.schema(M12.tableName)
      .id()
      .field(
        M12.friendId,
        .uuid,
        .required,
        .references(Friend.M11.tableName, .id, onDelete: .cascade),
      )
      .field(M12.city, .string, .required)
      .field(M12.region, .string, .required)
      .field(M12.duration, .dictionary)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .create()
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: CreateFriendResidences DOWN")
    try await database.schema(M12.tableName).delete()
  }
}
