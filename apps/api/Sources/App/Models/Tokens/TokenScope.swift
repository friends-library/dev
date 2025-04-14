import DuetSQL

enum Scope: String, Codable, CaseIterable, Equatable {
  case all
  case queryDownloads
  case mutateDownloads
  case queryOrders
  case mutateOrders
  case queryArtifactProductionVersions
  case mutateArtifactProductionVersions
  case queryEntities
  case mutateEntities
  case queryTokens
  case mutateTokens
}

struct TokenScope: Codable, Sendable {
  var id: Id
  var scope: Scope
  var tokenId: Token.Id
  var createdAt = Current.date()

  init(id: Id = .init(), tokenId: Token.Id, scope: Scope) {
    self.id = id
    self.scope = scope
    self.tokenId = tokenId
  }
}

// extensions

extension Scope: PostgresEnum {
  var typeName: String { TokenScope.M5.dbEnumName }
}

extension Scope {
  func can(_ requested: Scope) -> Bool {
    switch (self, requested) {
    case (.all, _): true
    case(let a, let b) where a == b: true
    case (.mutateDownloads, .queryDownloads): true
    case (.mutateOrders, .queryOrders): true
    case (.mutateArtifactProductionVersions, .queryArtifactProductionVersions): true
    case (.mutateEntities, .queryEntities): true
    case (.mutateTokens, .queryTokens): true
    default: false
    }
  }
}

extension [TokenScope] {
  func can(_ perform: Scope) -> Bool {
    contains(where: { $0.scope.can(perform) })
  }
}

extension [Scope] {
  func can(_ perform: Scope) -> Bool {
    contains(where: { $0.can(perform) })
  }
}
