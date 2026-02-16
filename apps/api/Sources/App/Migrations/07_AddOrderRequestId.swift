import Fluent
import Vapor

struct AddOrderRequestId: AsyncMigration {

  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AddOrderRequestId UP")
    try await database.schema(Order.M2.tableName)
      .field(
        Order.M7.freeOrderRequestId,
        .uuid,
        .references(
          FreeOrderRequest.M6.tableName,
          FreeOrderRequest.M6.id,
          onDelete: .setNull,
        ),
      )
      .update()
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AddOrderRequestId DOWN")
    try await database.schema(Order.M2.tableName)
      .deleteField(Order.M7.freeOrderRequestId)
      .update()
  }
}
