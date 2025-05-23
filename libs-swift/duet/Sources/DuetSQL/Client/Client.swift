import Duet
import Tagged

public protocol Client: SQLQuerying, SQLMutating, Sendable {
  func query<M: Model>(_ Model: M.Type) -> DuetQuery<M>

  @discardableResult
  func update<M: Model>(_ model: M) async throws -> M

  @discardableResult
  func create<M: Model>(_ models: [M]) async throws -> [M]

  func customQuery<T: CustomQueryable>(
    _ Custom: T.Type,
    withBindings: [Postgres.Data]?
  ) async throws -> [T]
}

public extension Client {
  func query<M: Model>(_: M.Type) -> DuetQuery<M> {
    DuetQuery<M>(db: self)
  }

  func customQuery<T: CustomQueryable>(_ Custom: T.Type) async throws -> [T] {
    try await self.customQuery(Custom, withBindings: nil)
  }

  func find<M: Model>(_: M.Type, byId id: UUID, withSoftDeleted: Bool = false) async throws -> M {
    try await self.query(M.self).byId(id, withSoftDeleted: withSoftDeleted).first()
  }

  func find<M: Model>(_ id: Tagged<M, UUID>, withSoftDeleted: Bool = false) async throws -> M {
    try await self.query(M.self).byId(id, withSoftDeleted: withSoftDeleted).first()
  }

  func find<M: Model>(
    _: M.Type,
    byId id: M.IdValue,
    withSoftDeleted: Bool = false
  ) async throws -> M {
    try await self.query(M.self).byId(id, withSoftDeleted: withSoftDeleted).first()
  }

  @discardableResult
  func create<M: Model>(_ model: M) async throws -> M {
    let models = try await create([model])
    return models.first ?? model
  }

  @discardableResult
  func delete<M: Model>(
    _: M.Type,
    byId id: UUIDStringable,
    force: Bool = false
  ) async throws -> M {
    try await self.query(M.self).where(M.column("id") == id).deleteOne(force: force)
  }

  @discardableResult
  func delete<M: Model>(_ id: Tagged<M, UUID>, force: Bool = false) async throws -> M {
    try await self.query(M.self).where(M.column("id") == id).deleteOne(force: force)
  }

  func deleteAll<M: Model>(_: M.Type, force: Bool = false) async throws {
    _ = try await self.query(M.self).delete(force: force)
  }
}
