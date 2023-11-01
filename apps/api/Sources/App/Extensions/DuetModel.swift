import DuetSQL

extension Model {
  @discardableResult
  func save() async throws -> Self {
    try await Current.db.update(self)
  }

  static func find(_ id: Tagged<Self, UUID>) async throws -> Self {
    try await Current.db.query(Self.self).byId(id).first()
  }

  static func deleteAll() async throws {
    try await Current.db.query(Self.self).delete()
  }

  static func query() -> DuetQuery<Self> {
    Current.db.query(Self.self)
  }

  @discardableResult
  static func create(_ model: Self) async throws -> Self {
    try await Current.db.create(model)
  }

  @discardableResult
  static func create(_ models: [Self]) async throws -> [Self] {
    try await Current.db.create(models)
  }
}