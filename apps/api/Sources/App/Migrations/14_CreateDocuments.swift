import Fluent
import Vapor

struct CreateDocuments: Migration {
  private typealias M14 = Document.M14

  func prepare(on database: Database) -> Future<Void> {
    Current.logger.info("Running migration: CreateDocuments UP")
    return database.schema(M14.tableName)
      .id()
      .field(
        M14.friendId,
        .uuid,
        .references(Friend.M11.tableName, .id, onDelete: .cascade),
        .required,
      )
      .field(
        M14.altLanguageId,
        .uuid,
        .references(M14.tableName, .id, onDelete: .setNull),
      )
      .field(M14.title, .string, .required)
      .field(M14.slug, .string, .required)
      .field(M14.filename, .string, .required)
      .field(M14.published, .int)
      .field(M14.originalTitle, .string)
      .field(M14.incomplete, .bool, .required)
      .field(M14.description, .string, .required)
      .field(M14.partialDescription, .string, .required)
      .field(M14.featuredDescription, .string)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .field(.deletedAt, .datetime)
      .unique(on: M14.filename)
      .unique(on: M14.title)
      .create()
  }

  func revert(on database: Database) -> Future<Void> {
    Current.logger.info("Running migration: CreateDocuments DOWN")
    return database.schema(M14.tableName).delete()
  }
}
