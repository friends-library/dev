import Fluent
import Vapor

struct CreateArtifactProductionVersions: AsyncMigration {
  // for rename to prevent conflict with pair type
  var name: String { "App.CreateArtifactProductionVersion" }

  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: CreateArtifactProductionVersions UP")
    try await database.schema(ArtifactProductionVersion.M8.tableName)
      .id()
      .field(ArtifactProductionVersion.M8.version, .string, .required)
      .field(.createdAt, .datetime, .required)
      .unique(on: ArtifactProductionVersion.M8.version)
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: CreateArtifactProductionVersions DOWN")
    try await database.schema(ArtifactProductionVersion.M8.tableName).delete()
  }
}
