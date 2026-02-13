import DuetSQL
import PostgresKit

struct FlushingDbClient: DuetSQL.Client {
  var origin: DuetSQL.Client

  func execute(raw: SQLQueryString) async throws -> [SQLRow] {
    try await self.origin.execute(raw: raw)
  }

  func execute(statement: SQL.Statement) async throws -> [SQLRow] {
    try await self.origin.execute(statement: statement)
  }

  func execute<M: DuetSQL.Model>(
    statement: SQL.Statement,
    returning: M.Type,
  ) async throws -> [M] {
    try await self.origin.execute(statement: statement, returning: M.self)
  }

  @discardableResult
  func update<M: DuetSQL.Model>(_ model: M) async throws -> M {
    let updated = try await origin.update(model)
    if M.isPreloaded {
      await self.flush()
    }
    return updated
  }

  @discardableResult
  func create<M: DuetSQL.Model>(_ model: M) async throws -> M {
    let created = try await origin.create(model)
    if M.isPreloaded {
      await self.flush()
    }
    return created
  }

  @discardableResult
  func create<M: DuetSQL.Model>(_ models: [M]) async throws -> [M] {
    let created = try await origin.create(models)
    if M.isPreloaded {
      await self.flush()
    }
    return created
  }

  @discardableResult
  func delete<M: DuetSQL.Model>(
    _ Model: M.Type,
    where constraint: SQL.WhereConstraint<M>,
    orderBy order: SQL.Order<M>?,
    limit: Int?,
    offset: Int?,
  ) async throws -> Int {
    let count = try await origin.delete(
      Model,
      where: constraint,
      orderBy: order,
      limit: limit,
      offset: offset,
    )
    if M.isPreloaded {
      await self.flush()
    }
    return count
  }

  @discardableResult
  func forceDelete<M: DuetSQL.Model>(
    _ Model: M.Type,
    where constraint: SQL.WhereConstraint<M>,
    orderBy order: SQL.Order<M>?,
    limit: Int?,
    offset: Int?,
  ) async throws -> Int {
    let count = try await origin.forceDelete(
      Model,
      where: constraint,
      orderBy: order,
      limit: limit,
      offset: offset,
    )
    if M.isPreloaded {
      await self.flush()
    }
    return count
  }

  private func flush() async {
    await JoinedEntityCache.shared.flush()
    await LegacyRest.cachedData.flush()
  }
}

extension FlushingDbClient {
  init(_ sql: SQLDatabase) {
    self.origin = SQLDatabaseClient(db: sql)
  }
}
