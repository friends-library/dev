import Foundation
import PairQL
import TaggedMoney

struct EditToken: Pair {
  static let auth: Scope = .queryTokens

  typealias Input = Token.Id

  struct Output: PairOutput {
    struct ScopeOutput: PairNestable {
      var id: TokenScope.Id
      var tokenId: Token.Id
      var scope: Scope
    }

    var id: Token.Id
    var value: Token.Value
    var description: String
    var uses: Int?
    var scopes: [ScopeOutput]
    var createdAt: Date
  }
}

extension EditToken: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    let token = try await Token.find(input)
    let scopes = try await token.scopes()
    return .init(
      id: token.id,
      value: token.value,
      description: token.description,
      uses: token.uses,
      scopes: scopes.map { .init(id: $0.id, tokenId: token.id, scope: $0.scope) },
      createdAt: token.createdAt,
    )
  }
}
