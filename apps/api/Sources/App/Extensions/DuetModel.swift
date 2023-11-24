import DuetSQL

extension Model {
  @discardableResult
  func save() async throws -> Self {
    try await Current.db.update(self)
  }

  @discardableResult
  func create() async throws -> Self {
    try await Current.db.create(self)
  }

  @discardableResult
  func upsert() async throws -> Self {
    if (try? await Current.db.query(Self.self).byId(id).first()) == nil {
      return try await create()
    } else {
      return try await save()
    }
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

  func delete() async throws {
    try await Current.db.query(Self.self).byId(id).delete()
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

extension Array where Element: Model {
  @discardableResult
  func create() async throws -> Self {
    try await Current.db.create(self)
  }

  @discardableResult
  func save() async throws -> Self {
    try await Current.db.update(self)
  }
}
