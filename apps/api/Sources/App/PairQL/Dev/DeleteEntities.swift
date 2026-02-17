import DuetSQL
import Foundation
import PairQL

struct DeleteEntities: Pair {
  static let auth: Scope = .mutateEntities

  enum Input: PairInput {
    case editionImpression(id: EditionImpression.Id)
    case editionChapters(id: Edition.Id)
  }
}

extension DeleteEntities: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    switch input {
    case .editionImpression(let id):
      try await context.db.delete(id)
    case .editionChapters(let editionId):
      try await context.db.query(EditionChapter.self)
        .where(.editionId == editionId)
        .delete(in: context.db)
    }
    return .success
  }
}
