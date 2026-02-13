import PairQL

struct LatestArtifactProductionVersion: Pair {
  static let auth: Scope = .queryArtifactProductionVersions

  struct Output: PairOutput {
    var version: String
  }
}

extension LatestArtifactProductionVersion: NoInputResolver {
  static func resolve(in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    let latest = try await ArtifactProductionVersion.query()
      .orderBy(.createdAt, .desc)
      .first(in: Current.db)
    return .init(version: latest.version.rawValue)
  }
}
