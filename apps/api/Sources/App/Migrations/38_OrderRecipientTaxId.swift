import Fluent
import Vapor

struct OrderRecipientTaxId: AsyncMigration {
  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: OrderRecipientTaxId UP")
    try await database.schema(Order.M2.tableName)
      .field(Order.M38.recipientTaxId, .string)
      .update()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: OrderRecipientTaxId DOWN")
    try await database.schema(Order.M2.tableName)
      .deleteField(Order.M38.recipientTaxId)
      .update()
  }
}

extension Order {
  enum M38 {
    static let recipientTaxId = FieldKey("recipient_tax_id")
  }
}
