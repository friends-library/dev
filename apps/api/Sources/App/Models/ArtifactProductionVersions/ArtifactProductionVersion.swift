import Foundation

struct ArtifactProductionVersion: Codable, Sendable {
  var id: Id
  var version: GitCommitSha
  var createdAt = Current.date()

  init(id: Id = .init(), version: GitCommitSha) {
    self.id = id
    self.version = version
  }
}

// extensions

extension ArtifactProductionVersion {
  func isValid() async -> Bool {
    version.rawValue.isValidGitCommitFullSha
  }
}
