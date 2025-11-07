import PairQL

struct CreateArtifactProductionVersion: Pair {
  static let auth: Scope = .mutateArtifactProductionVersions

  struct Input: PairInput {
    var version: String
  }

  struct Output: PairOutput {
    var id: ArtifactProductionVersion.Id
  }
}

extension CreateArtifactProductionVersion: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    if !input.version.isValidGitCommitFullSha {
      throw context.error(
        id: "4e50182e",
        type: .badRequest,
        detail: "invalid version, must be 40 char full git sha",
      )
    }
    let apf = try await ArtifactProductionVersion.create(.init(version: .init(input.version)))
    return Output(id: apf.id)
  }
}
