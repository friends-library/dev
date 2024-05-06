import Fluent
import Vapor

struct AddSentNPQuotes: AsyncMigration {
  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: AddSentNpQuotes UP")
    try await database.schema(SentNPQuote.M38.tableName)
      .id()
      .field(.createdAt, .datetime, .required)
      .field(
        SentNPQuote.M38.quoteId,
        .uuid,
        .references(NPQuote.M37.tableName, .id, onDelete: .cascade)
      )
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: AddSentNpQuotes DOWN")
    try await database.schema(SentNPQuote.M38.tableName).delete()
  }
}

extension SentNPQuote {
  enum M38 {
    static let tableName = "sent_np_quotes"
    static let quoteId = FieldKey("quote_id")
  }
}
