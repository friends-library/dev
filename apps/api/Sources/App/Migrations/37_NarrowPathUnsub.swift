import Fluent
import Vapor

struct NarrowPathUnsub: AsyncMigration {
  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: NarrowPathUnsub UP")
    try await database.schema(NPSubscriber.M36.tableName)
      .field(NPSubscriber.M37.unsubscribedAt, .datetime)
      .update()
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: NarrowPathUnsub DOWN")
    try await database.schema(NPSubscriber.M36.tableName)
      .deleteField(NPSubscriber.M37.unsubscribedAt)
      .update()
  }
}

extension NPSubscriber {
  enum M37 {
    static let unsubscribedAt = FieldKey("unsubscribed_at")
  }
}
