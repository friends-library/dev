import Fluent
import Vapor

struct CreateTokenScopes: AsyncMigration {
  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: CreateTokenScopes UP")
    let scopes = try await database.enum(TokenScope.M5.dbEnumName)
      .case(TokenScope.M5.Scope.queryDownloads)
      .case(TokenScope.M5.Scope.mutateDownloads)
      .case(TokenScope.M5.Scope.queryOrders)
      .case(TokenScope.M5.Scope.mutateOrders)
      .create()

    try await database.schema(TokenScope.M5.tableName)
      .id()
      .field(
        TokenScope.M5.tokenId,
        .uuid,
        .required,
        .references(Token.M4.tableName, "id", onDelete: .cascade),
      )
      .field(TokenScope.M5.scope, scopes, .required)
      .field(.createdAt, .datetime, .required)
      .unique(on: TokenScope.M5.tokenId, TokenScope.M5.scope)
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: CreateTokenScopes DOWN")
    try await database.schema(TokenScope.M5.tableName).delete()
    try await database.enum(TokenScope.M5.dbEnumName).delete()
  }
}
