import Fluent
import Vapor

struct AddMutateArtifactProductionVersionScope: AsyncMigration {

  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: AddMutateArtifactProductionVersionScope UP")
    _ = try await database.enum(TokenScope.M5.dbEnumName)
      .case(TokenScope.M9.Scope.mutateArtifactProductionVersions)
      .update()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: AddMutateArtifactProductionVersionScope DOWN")
    _ = try await database.enum(TokenScope.M5.dbEnumName)
      .deleteCase(TokenScope.M9.Scope.mutateArtifactProductionVersions)
      .update()
  }
}
