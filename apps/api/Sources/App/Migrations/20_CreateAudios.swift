import Fluent

struct CreateAudios: Migration {
  private typealias M20 = Audio.M20

  func prepare(on database: Database) -> Future<Void> {
    Current.logger.info("Running migration: CreateAudios UP")
    return database.schema(M20.tableName)
      .id()
      .field(
        M20.editionId,
        .uuid,
        .references(Edition.M17.tableName, .id, onDelete: .cascade),
        .required,
      )
      .field(M20.reader, .string, .required)
      .field(M20.isIncomplete, .bool, .required)
      .field(M20.mp3ZipSizeHq, .int, .required)
      .field(M20.mp3ZipSizeLq, .int, .required)
      .field(M20.m4bSizeHq, .int, .required)
      .field(M20.m4bSizeLq, .int, .required)
      .field(M20.externalPlaylistIdHq, .int64)
      .field(M20.externalPlaylistIdLq, .int64)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .unique(on: M20.editionId)
      .create()
  }

  func revert(on database: Database) -> Future<Void> {
    Current.logger.info("Running migration: CreateAudios DOWN")
    return database.schema(M20.tableName).delete()
  }
}
