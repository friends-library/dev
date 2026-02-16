import Foundation
import PairQL
import TaggedTime

struct DeleteEntity: Pair {
  static let auth: Scope = .queryTokens

  struct Input: PairInput {
    let type: AdminRoute.EntityType
    let id: UUID
  }
}

// resolver

extension DeleteEntity: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    guard let model = try? await context.db.find(input.type.modelType, byId: input.id) else {
      switch input.type {
      case .friend, .token:
        throw context.error(
          id: "f4d9cc7e",
          type: .notFound,
          detail: "\(input.type):\(input.id.lowercased) not found",
        )
      // for all non-root entity types, 404 = success, b/c cascading FK deletes
      default:
        return .success
      }
    }

    try await context.db.delete(model)
    return .success
  }
}
