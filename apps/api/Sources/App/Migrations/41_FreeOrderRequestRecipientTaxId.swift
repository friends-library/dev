import Fluent
import Vapor

struct FreeOrderRequestRecipientTaxId: AsyncMigration {
  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: FreeOrderRequestRecipientTaxId UP")
    try await database.schema(FreeOrderRequest.M6.tableName)
      .field(FreeOrderRequest.M41.recipientTaxId, .string)
      .update()
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: FreeOrderRequestRecipientTaxId DOWN")
    try await database.schema(FreeOrderRequest.M6.tableName)
      .deleteField(FreeOrderRequest.M41.recipientTaxId)
      .update()
  }
}

extension FreeOrderRequest {
  enum M41 {
    static let recipientTaxId = FieldKey("recipient_tax_id")
  }
}
