import Fluent

struct CreateEditionChapters: Migration {
  private typealias M22 = EditionChapter.M22

  func prepare(on database: Database) -> Future<Void> {
    Current.logger.info("Running migration: CreateEditionChapters UP")
    return database.schema(M22.tableName)
      .id()
      .field(
        M22.editionId,
        .uuid,
        .references(Edition.M17.tableName, .id, onDelete: .cascade),
        .required
      )
      .field(M22.order, .int, .required)
      .field(M22.customId, .string)
      .field(M22.shortHeading, .string, .required)
      .field(M22.isIntermediateTitle, .bool, .required)
      .field(M22.sequenceNumber, .int)
      .field(M22.nonSequenceTitle, .string)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .unique(on: M22.editionId, M22.order)
      .create()
  }

  func revert(on database: Database) -> Future<Void> {
    Current.logger.info("Running migration: CreateEditionChapters DOWN")
    return database.schema(M22.tableName).delete()
  }
}
