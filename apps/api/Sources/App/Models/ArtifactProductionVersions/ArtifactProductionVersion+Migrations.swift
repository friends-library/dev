import Fluent

extension ArtifactProductionVersion {
  enum M8 {
    static let tableName = "artifact_production_versions"
    nonisolated(unsafe) static let version = FieldKey("version")
  }
}
