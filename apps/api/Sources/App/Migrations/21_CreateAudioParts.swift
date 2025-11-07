import Fluent

struct CreateAudioParts: Migration {
  private typealias M21 = AudioPart.M21

  func prepare(on database: Database) -> Future<Void> {
    Current.logger.info("Running migration: CreateAudioParts UP")
    return database.schema(M21.tableName)
      .id()
      .field(
        M21.audioId,
        .uuid,
        .references(Audio.M20.tableName, .id, onDelete: .cascade),
        .required,
      )
      .field(M21.title, .string, .required)
      .field(M21.duration, .double, .required)
      .field(M21.chapters, .array(of: .int), .required)
      .field(M21.order, .int, .required)
      .field(M21.mp3SizeHq, .int, .required)
      .field(M21.mp3SizeLq, .int, .required)
      .field(M21.externalIdHq, .int64)
      .field(M21.externalIdLq, .int64)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .unique(on: M21.audioId, M21.order)
      .create()
  }

  func revert(on database: Database) -> Future<Void> {
    Current.logger.info("Running migration: CreateAudioParts DOWN")
    return database.schema(M21.tableName).delete()
  }
}
