import DuetSQL
import PairQL

struct ReplaceEditionChapters: Pair {
  static let auth: Scope = .mutateEntities

  struct ChapterInput: PairInput {
    let order: Int
    let shortHeading: String
    let isIntermediateTitle: Bool
    let customId: String?
    let sequenceNumber: Int?
    let nonSequenceTitle: String?
  }

  struct Input: PairInput {
    let editionId: Edition.Id
    let chapters: [ChapterInput]
  }
}

extension ReplaceEditionChapters: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    let chapters = input.chapters.map {
      EditionChapter(input: $0, editionId: input.editionId)
    }
    for chapter in chapters {
      guard await chapter.isValid() else {
        throw ModelError.invalidEntity
      }
    }
    try await context.db.withTransaction { db in
      try await db.query(EditionChapter.self)
        .where(.editionId == input.editionId)
        .delete(in: db)
      try await db.create(chapters)
    }
    return .success
  }
}

extension EditionChapter {
  init(input: ReplaceEditionChapters.ChapterInput, editionId: Edition.Id) {
    self.init(
      editionId: editionId,
      order: input.order,
      shortHeading: input.shortHeading,
      isIntermediateTitle: input.isIntermediateTitle,
      customId: input.customId,
      sequenceNumber: input.sequenceNumber,
      nonSequenceTitle: input.nonSequenceTitle,
    )
  }
}
