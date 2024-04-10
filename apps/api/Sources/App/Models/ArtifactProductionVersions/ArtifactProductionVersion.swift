import Foundation

struct ArtifactProductionVersion: Codable {
  var id: Id
  var version: GitCommitSha
  var createdAt = Current.date()

  var isValid: Bool {
    version.rawValue.isValidGitCommitFullSha
  }

  init(id: Id = .init(), version: GitCommitSha) {
    self.id = id
    self.version = version
  }
}
