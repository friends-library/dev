import Fluent
import Vapor

struct CreateFriendQuotes: AsyncMigration {
  private typealias M13 = FriendQuote.M13

  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: CreateFriendQuotes UP")
    try await database.schema(M13.tableName)
      .id()
      .field(
        M13.friendId,
        .uuid,
        .required,
        .references(Friend.M11.tableName, .id, onDelete: .cascade),
      )
      .field(M13.source, .string, .required)
      .field(M13.text, .string, .required)
      .field(M13.order, .int, .required)
      .field(M13.context, .string)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .unique(on: M13.friendId, M13.order)
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: CreateFriendQuotes DOWN")
    try await database.schema(M13.tableName).delete()
  }
}
