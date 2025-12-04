import Fluent

struct CreateRelatedDocuments: AsyncMigration {
  private typealias M23 = RelatedDocument.M23

  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: CreateRelatedDocuments UP")
    try await database.schema(M23.tableName)
      .id()
      .field(
        M23.parentDocumentId,
        .uuid,
        .references(Document.M14.tableName, .id, onDelete: .cascade),
        .required,
      )
      .field(
        M23.documentId,
        .uuid,
        .references(Document.M14.tableName, .id, onDelete: .cascade),
        .required,
      )
      .field(M23.description, .string, .required)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: CreateRelatedDocuments DOWN")
    try await database.schema(M23.tableName).delete()
  }
}
