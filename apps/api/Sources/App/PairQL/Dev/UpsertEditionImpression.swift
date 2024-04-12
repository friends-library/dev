import PairQL

struct UpsertEditionImpression: Pair {
  static var auth: Scope = .mutateEntities

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
    try context.verify(Self.auth)
    let impression = EditionImpression(
      id: input.id,
      editionId: input.editionId,
      adocLength: input.adocLength,
      paperbackSizeVariant: input.paperbackSizeVariant,
      paperbackVolumes: try .fromArray(input.paperbackVolumes),
      publishedRevision: input.publishedRevision,
      productionToolchainRevision: input.productionToolchainRevision
    )
    guard impression.isValid else { throw ModelError.invalidEntity }
    try await impression.upsert()
    // TODO: check this, used to have cache ramifications...
    let files = try await impression.files()
    return .init(id: impression.id, cloudFiles: .init(files: files))
  }
}
