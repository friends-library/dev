import Dependencies
import DuetSQL
import PairQL
import TypeScriptInterop
import Vapor

protocol ResolverContext {
  var requestId: String { get }
}

extension ResolverContext {
  func error(id: String, type: PqlError.Kind, detail: String? = nil) -> PqlError {
    .init(id: id, requestId: requestId, type: type, detail: detail)
  }
}

struct Context: ResolverContext {
  var requestId: String
  @Dependency(\.db) var db
}

struct AuthedContext: ResolverContext {
  var requestId: String
  var scopes: [TokenScope]
  @Dependency(\.db) var db

  func verify(_ scope: Scope) throws {
    guard self.scopes.can(scope) else {
      throw error(
        id: "7bdaa820",
        type: .unauthorized,
        detail: "Not authorized to `.\(scope)`",
      )
    }
  }
}

extension Infallible: @retroactive TypeScriptAliased {
  public static var typescriptAlias: String { "void" }
}
