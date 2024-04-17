import DuetSQL
import FluentSQL

// class LiveDatabase: DuetSQL.Client {
//   private let db: SQLDatabase
//   private let dbClient: DuetSQL.Client
//   private var _entityClient: DuetSQL.Client?

//   init(db: SQLDatabase) {
//     self.db = db
//     dbClient = LiveClient(sql: db)
//   }

//   func query<M: DuetSQL.Model>(_ Model: M.Type) -> DuetQuery<M> {
//     .init(db: self)
//   }

//   @discardableResult
//   func create<M: DuetSQL.Model>(_ models: [M]) async throws -> [M] {
//     let models = try await dbClient.create(models)
//     if M.isPreloaded { await flushEntities() }
//     return models
//   }

//   @discardableResult
//   func update<M: DuetSQL.Model>(_ model: M) async throws -> M {
//     let models = try await dbClient.update(model)
//     if M.isPreloaded { await flushEntities() }
//     return models
//   }

//   @discardableResult
//   func forceDelete<M: DuetSQL.Model>(
//     _ Model: M.Type,
//     where constraint: SQL.WhereConstraint<M> = .always,
//     orderBy: SQL.Order<M>? = nil,
//     limit: Int? = nil,
//     offset: Int? = nil
//   ) async throws -> [M] {
//     let models = try await dbClient.forceDelete(
//       Model,
//       where: constraint,
//       orderBy: orderBy,
//       limit: limit,
//       offset: offset
//     )
//     if M.isPreloaded { await flushEntities() }
//     return models
//   }

//   @discardableResult
//   func delete<M: DuetSQL.Model>(
//     _ Model: M.Type,
//     where constraint: SQL.WhereConstraint<M> = .always,
//     orderBy order: SQL.Order<M>? = nil,
//     limit: Int? = nil,
//     offset: Int? = nil
//   ) async throws -> [M] {
//     let models = try await dbClient.delete(
//       Model,
//       where: constraint,
//       orderBy: order,
//       limit: limit,
//       offset: offset
//     )
//     if M.isPreloaded { await flushEntities() }
//     return models
//   }

//   func select<M: DuetSQL.Model>(
//     _ Model: M.Type,
//     where constraint: SQL.WhereConstraint<M> = .always,
//     orderBy: SQL.Order<M>? = nil,
//     limit: Int? = nil,
//     offset: Int? = nil,
//     withSoftDeleted: Bool = false
//   ) async throws -> [M] {
//     if M.isPreloaded {
//       return try await entityClient.select(
//         M.self,
//         where: constraint + .notSoftDeleted,
//         orderBy: orderBy,
//         limit: limit,
//         offset: offset,
//         withSoftDeleted: withSoftDeleted
//       )
//     }
//     return try await dbClient.select(
//       Model,
//       where: constraint,
//       orderBy: orderBy,
//       limit: limit,
//       offset: offset,
//       withSoftDeleted: withSoftDeleted
//     )
//   }

//   func count<M>(
//     _: M.Type,
//     where: DuetSQL.SQL.WhereConstraint<M>,
//     withSoftDeleted: Bool
//   ) async throws -> Int where M: DuetSQL.Model {
//     try await dbClient.count(M.self, where: `where`, withSoftDeleted: withSoftDeleted)
//   }

//   private var entityClient: DuetSQL.Client {
//     get async throws {
//       if let client = _entityClient {
//         return client
//       } else {
//         let client = MemoryClient(store: try await queryPreloadedEntities(on: db))
//         _entityClient = client
//         return client
//       }
//     }
//   }

//   fileprivate func flushEntities() async {
//     _entityClient = nil
//     await LegacyRest.cachedData.flush()
//   }

//   func customQuery<T: CustomQueryable>(
//     _ Custom: T.Type,
//     withBindings bindings: [Postgres.Data]?
//   ) async throws -> [T] {
//     try await dbClient.customQuery(Custom, withBindings: bindings)
//   }
// }

// extension DuetSQL.Client {
//   func clearEntityCache() async throws {
//     if let liveDb = self as? LiveDatabase {
//       await liveDb.flushEntities()
//     }
//   }
// }
