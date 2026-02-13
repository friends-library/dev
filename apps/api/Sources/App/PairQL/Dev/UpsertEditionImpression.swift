import PairQL

struct UpsertEditionImpression: Pair {
  static let auth: Scope = .mutateEntities

  struct Input: PairInput {
    let id: EditionImpression.Id
    let editionId: Edition.Id
    let adocLength: Int
    let paperbackSizeVariant: PrintSizeVariant
    let paperbackVolumes: [Int]
    let publishedRevision: GitCommitSha
    let productionToolchainRevision: GitCommitSha
  }

  typealias Output = GetEditionImpression.Output
}

extension UpsertEditionImpression: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    let impression = try EditionImpression(
      id: input.id,
      editionId: input.editionId,
      adocLength: input.adocLength,
      paperbackSizeVariant: input.paperbackSizeVariant,
      paperbackVolumes: .fromArray(input.paperbackVolumes),
      publishedRevision: input.publishedRevision,
      productionToolchainRevision: input.productionToolchainRevision,
    )
    guard await impression.isValid() else { throw ModelError.invalidEntity }
    try await Current.db.upsert(impression)
    let joined = try await EditionImpression.Joined.find(input.id)
    return .init(id: impression.id, cloudFiles: .init(files: joined.files))
  }
}
