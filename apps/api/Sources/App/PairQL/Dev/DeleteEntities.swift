import DuetSQL
import Foundation
import PairQL
import TSCodable

struct DeleteEntities: Pair {
  static let auth: Scope = .mutateEntities

  @TSCodable
  enum Input: PairInput {
    case editionImpression(id: EditionImpression.Id)
  }
}

extension DeleteEntities: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    switch input {
    case .editionImpression(let id):
      try await context.db.delete(id)
    }
    return .success
  }
}
