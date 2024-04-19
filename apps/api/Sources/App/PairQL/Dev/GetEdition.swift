import PairQL

struct GetEdition: Pair {
  static let auth: Scope = .queryEntities

  typealias Input = Edition.Id

  struct Output: PairOutput {
    struct Image: PairNestable {
      let width: Int
      let filename: String
      let path: String
    }

    struct Impression: PairNestable {
      let id: EditionImpression.Id
      let adocLength: Int
      let paperbackSizeVariant: PrintSizeVariant
      let paperbackSize: PrintSize
      let paperbackVolumes: [Int]
      let publishedRevision: GitCommitSha
      let productionToolchainRevision: GitCommitSha
    }

    let type: EditionType
    let isDraft: Bool
    let allSquareImages: [Image]
    let allThreeDImages: [Image]
    let impression: Impression?
    let documentFilename: String
  }
}

extension GetEdition: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    let edition = try await Edition.find(input)
    let impression = try await edition.impression()
    let document = try await edition.document()
    return .init(
      type: edition.type,
      isDraft: edition.isDraft,
      allSquareImages: [], // edition.images.square.all.map(Output.Image.init),
      allThreeDImages: [], // edition.images.threeD.all.map(Output.Image.init),
      impression: impression.map { .init(
        id: $0.id,
        adocLength: $0.adocLength,
        paperbackSizeVariant: $0.paperbackSizeVariant,
        paperbackSize: $0.paperbackSize,
        paperbackVolumes: Array($0.paperbackVolumes),
        publishedRevision: $0.publishedRevision,
        productionToolchainRevision: $0.productionToolchainRevision
      ) },
      documentFilename: document.filename
    )
  }
}

extension GetEdition.Output.Image {
  init(_ image: Edition.Images.Image) {
    self.init(width: image.width, filename: image.filename, path: image.path)
  }
}
