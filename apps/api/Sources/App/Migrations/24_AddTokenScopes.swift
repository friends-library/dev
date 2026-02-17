import Fluent
import Vapor

struct AddTokenScopes: AsyncMigration {

  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AddTokenScopes UP")
    try await addDbEnumCases(db: database, enumName: TokenScope.M5.dbEnumName, newCases: [
      TokenScope.M24.Scope.caseAll,
      TokenScope.M24.Scope.caseQueryArtifactProductionVersions,
      TokenScope.M24.Scope.caseQueryEntities,
      TokenScope.M24.Scope.caseMutateEntities,
      TokenScope.M24.Scope.caseQueryTokens,
      TokenScope.M24.Scope.caseMutateTokens,
    ])
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AddTokenScopes DOWN")
    // I don't think postgres supports deleting enum cases... ¯\_(ツ)_/¯
  }
}

extension TokenScope {
  enum M24 {
    enum Scope {
      static let caseAll = "all"
      static let caseQueryArtifactProductionVersions = "queryArtifactProductionVersions"
      static let caseQueryEntities = "queryEntities"
      static let caseMutateEntities = "mutateEntities"
      static let caseQueryTokens = "queryTokens"
      static let caseMutateTokens = "mutateTokens"
    }
  }
}
