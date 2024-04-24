import Fluent
import Vapor

struct AddNPQuotes: AsyncMigration {
  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: AddNPQuotes UP")
    let lang = try await database.enum(Order.M2.LangEnum.name).read()
    try await database.schema(NPQuote.M37.tableName)
      .id()
      .field(NPQuote.M37.lang, lang, .required)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .field(NPQuote.M37.isFriend, .bool, .required)
      .field(NPQuote.M37.quote, .string, .required)
      .field(NPQuote.M37.authorName, .string, .required)
      .field(
        NPQuote.M37.authorId,
        .uuid,
        .references(Friend.M11.tableName, .id, onDelete: .setNull)
      )
      .field(
        NPQuote.M37.documentId,
        .uuid,
        .references(Document.M14.tableName, .id, onDelete: .setNull)
      )
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: AddNPQuotes DOWN")
    try await database.schema(NPQuote.M37.tableName).delete()
  }
}

extension NPQuote {
  enum M37 {
    static let tableName = "np_quotes"
    static let lang = FieldKey("lang")
    static let isFriend = FieldKey("is_friend")
    static let quote = FieldKey("quote")
    static let authorId = FieldKey("author_id")
    static let authorName = FieldKey("author_name")
    static let documentId = FieldKey("document_id")
  }
}
