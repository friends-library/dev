import Fluent
import Vapor

struct CreateTokens: AsyncMigration {
  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: CreateTokens UP")
    try await database.schema(Token.M4.tableName)
      .id()
      .field(Token.M4.value, .uuid, .required)
      .field(Token.M4.description, .string, .required)
      .field(.createdAt, .datetime, .required)
      .unique(on: Token.M4.value)
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: CreateTokens DOWN")
    try await database.schema(Token.M4.tableName).delete()
  }
}
