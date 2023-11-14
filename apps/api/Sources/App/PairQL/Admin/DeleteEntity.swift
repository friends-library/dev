import Foundation
import PairQL
import TaggedTime

struct DeleteEntity: Pair {
  static var auth: Scope = .queryTokens

  struct Input: PairInput {
    let type: AdminRoute.EntityType
    let id: UUID
  }

  typealias Output = Infallible
}

// resolver

extension DeleteEntity: PairQL.Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    guard let model = try? await Current.db.find(input.type.modelType, byId: input.id) else {
      switch input.type {
      case .friend, .token:
        throw context.error(
          id: "f4d9cc7e",
          type: .notFound,
          detail: "\(input.type):\(input.id.lowercased) not found"
        )
      // for all non-root entity types, 404 = success, b/c cascading FK deletes
      default:
        return .success
      }
    }

    try await model.delete()
    return .success
  }
}
