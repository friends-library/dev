import DuetSQL
import FluentSQL

struct FlushingDbClient: DuetSQL.Client {
  var origin: DuetSQL.Client

  func update<M>(_ model: M) async throws -> M where M: DuetSQL.Model {
    let updated = try await origin.update(model)
    if M.isPreloaded {
      await JoinedEntities.shared.flush()
    }
    return updated
  }

  func customQuery<T>(
    _ Custom: T.Type,
    withBindings: [DuetSQL.Postgres.Data]?
  ) async throws -> [T]
    where T: DuetSQL.CustomQueryable {
    try await origin.customQuery(Custom, withBindings: withBindings)
  }

  func select<M>(
    _ Model: M.Type,
    where constraint: DuetSQL.SQL.WhereConstraint<M>,
    orderBy order: DuetSQL.SQL.Order<M>?,
    limit: Int?,
    offset: Int?,
    withSoftDeleted: Bool
  ) async throws -> [M] where M: DuetSQL.Model {
    try await origin.select(
      Model,
      where: constraint,
      orderBy: order,
      limit: limit,
      offset: offset,
      withSoftDeleted: withSoftDeleted
    )
  }

  func count<M>(
    _: M.Type,
    where constraint: DuetSQL.SQL.WhereConstraint<M>,
    withSoftDeleted: Bool
  ) async throws -> Int where M: DuetSQL.Model {
    try await origin.count(M.self, where: constraint, withSoftDeleted: withSoftDeleted)
  }

  func create<M>(_ models: [M]) async throws -> [M] where M: DuetSQL.Model {
    let created = try await origin.create(models)
    if M.isPreloaded {
      await JoinedEntities.shared.flush()
    }
    return created
  }

  @discardableResult
  func delete<M: DuetSQL.Model>(
    _ Model: M.Type,
    where constraints: SQL.WhereConstraint<M>,
    orderBy order: SQL.Order<M>?,
    limit: Int?,
    offset: Int?
  ) async throws -> [M] {
    let deleted = try await origin.delete(
      Model,
      where: constraints,
      orderBy: order,
      limit: limit,
      offset: offset
    )
    if M.isPreloaded {
      await JoinedEntities.shared.flush()
    }
    return deleted
  }

  func forceDelete<M>(
    _ Model: M.Type,
    where constraints: DuetSQL.SQL.WhereConstraint<M>,
    orderBy order: DuetSQL.SQL.Order<M>?,
    limit: Int?,
    offset: Int?
  ) async throws -> [M] where M: DuetSQL.Model {
    let deleted = try await origin.forceDelete(
      Model,
      where: constraints,
      orderBy: order,
      limit: limit,
      offset: offset
    )
    if M.isPreloaded {
      await JoinedEntities.shared.flush()
    }
    return deleted
  }
}

extension FlushingDbClient {
  init(_ sql: SQLDatabase) {
    origin = LiveClient(sql: sql)
  }
}
