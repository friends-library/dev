import PairQL

struct CreateEditionChapters: Pair {
  static let auth: Scope = .mutateEntities

  struct CreateEditionChapterInput: PairInput {
    let editionId: Edition.Id
    let order: Int
    let shortHeading: String
    let isIntermediateTitle: Bool
    let customId: String?
    let sequenceNumber: Int?
    let nonSequenceTitle: String?
  }

  typealias Input = [CreateEditionChapterInput]
}

extension CreateEditionChapters: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    let chapters = input.map(EditionChapter.init(input:))
    for chapter in chapters {
      guard await chapter.isValid() else {
        throw ModelError.invalidEntity
      }
    }
    try await context.db.create(chapters)
    return .success
  }
}

extension EditionChapter {
  init(input: CreateEditionChapters.CreateEditionChapterInput) {
    self.init(
      editionId: input.editionId,
      order: input.order,
      shortHeading: input.shortHeading,
      isIntermediateTitle: input.isIntermediateTitle,
      customId: input.customId,
      sequenceNumber: input.sequenceNumber,
      nonSequenceTitle: input.nonSequenceTitle,
    )
  }
}
