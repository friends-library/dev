import Fluent
import Vapor

struct DropFriendResidenceDurationCol: AsyncMigration {

  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: DropFriendResidenceDurationCol UP")
    try await database.schema(FriendResidence.M12.tableName)
      .deleteField(FriendResidence.M12.duration)
      .update()
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: DropFriendResidenceDurationCol DOWN")
    try await database.schema(FriendResidence.M12.tableName)
      .field(FriendResidence.M12.duration, .dictionary)
      .update()
  }
}
