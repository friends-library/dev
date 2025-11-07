import DuetSQL
import Tagged

struct Token: Codable, Sendable {
  var id: Id
  var value: Value
  var description: String
  var uses: Int?
  var createdAt = Current.date()

  init(
    id: Id = .init(),
    value: Value = .init(),
    description: String,
    uses: Int? = nil,
  ) {
    self.id = id
    self.value = value
    self.description = description
    self.uses = uses
  }
}

/// extensions

extension Token {
  typealias Value = Tagged<(Token, value: ()), UUID>

  func scopes() async throws -> [TokenScope] {
    try await TokenScope.query()
      .where(.tokenId == self.id)
      .all()
  }
}
