import Foundation
import PairQL
import TaggedMoney

struct ListTokens: Pair {
  static var auth: Scope = .queryTokens

  typealias Output = [EditToken.Output]
}

extension ListTokens: NoInputResolver {
  static func resolve(in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    let tokens = try await Token.query().all()
    return try await tokens.concurrentMap { token in
      var token = token
      let scopes = try await token.scopes()
      return .init(
        id: token.id,
        value: token.value,
        description: token.description,
        uses: token.uses,
        scopes: scopes.map { .init(id: $0.id, tokenId: token.id, scope: $0.scope) },
        createdAt: token.createdAt
      )
    }
  }
}
