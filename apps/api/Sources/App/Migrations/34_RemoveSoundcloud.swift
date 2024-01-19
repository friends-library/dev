import Fluent
import Vapor

struct RemoveSoundcloud: AsyncMigration {
  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: RemoveSoundcloud UP")
    try await database.schema(Audio.M20.tableName)
      .deleteField(Audio.M20.externalPlaylistIdHq)
      .update()
    try await database.schema(Audio.M20.tableName)
      .deleteField(Audio.M20.externalPlaylistIdLq)
      .update()
    try await database.schema(AudioPart.M21.tableName)
      .deleteField(AudioPart.M21.externalIdHq)
      .update()
    try await database.schema(AudioPart.M21.tableName)
      .deleteField(AudioPart.M21.externalIdLq)
      .update()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: RemoveSoundcloud DOWN")
    try await database.schema(Audio.M20.tableName)
      .field(Audio.M20.externalPlaylistIdHq, .int)
      .update()
    try await database.schema(Audio.M20.tableName)
      .field(Audio.M20.externalPlaylistIdLq, .int)
      .update()
    try await database.schema(AudioPart.M21.tableName)
      .field(AudioPart.M21.externalIdHq, .int)
      .update()
    try await database.schema(AudioPart.M21.tableName)
      .field(AudioPart.M21.externalIdLq, .int)
      .update()
  }
}
