import DuetSQL
import Foundation

@DuetModel(table: "artifact_production_versions")
struct ArtifactProductionVersion: Codable, Sendable, Equatable {
  var id: Id
  var version: GitCommitSha
  var createdAt = Date()

  init(id: Id = .init(), version: GitCommitSha) {
    self.id = id
    self.version = version
  }
}

// extensions

extension ArtifactProductionVersion {
  func isValid() async -> Bool {
    self.version.rawValue.isValidGitCommitFullSha
  }
}
