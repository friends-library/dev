import Fluent

struct CreateIsbns: AsyncMigration {
  private typealias M19 = Isbn.M19

  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: CreateIsbns UP")
    try await database.schema(M19.tableName)
      .id()
      .field(M19.code, .string, .required)
      .field(
        M19.editionId,
        .uuid,
        .references(Edition.M17.tableName, .id, onDelete: .setNull),
      )
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .unique(on: M19.code)
      .create()
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: CreateIsbns DOWN")
    try await database.schema(M19.tableName).delete()
  }
}
