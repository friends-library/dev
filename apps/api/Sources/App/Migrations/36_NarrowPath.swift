import Fluent
import Vapor

struct NarrowPath: AsyncMigration {
  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: NarrowPath UP")
    let lang = try await database.enum(Order.M2.LangEnum.name).read()
    try await database.schema(NPSubscriber.M36.tableName)
      .id()
      .field(NPSubscriber.M36.email, .string, .required)
      .field(NPSubscriber.M36.pendingConfirmationToken, .uuid)
      .field(NPSubscriber.M36.lang, lang, .required)
      .field(NPSubscriber.M36.mixedQuotes, .bool, .required)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .unique(on: NPSubscriber.M36.email, NPSubscriber.M36.lang)
      .create()

    try await database.schema(NPQuote.M37.tableName)
      .id()
      .field(NPQuote.M37.lang, lang, .required)
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
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .create()

    try await database.schema(NPSentQuote.M38.tableName)
      .id()
      .field(
        NPSentQuote.M38.quoteId,
        .uuid,
        .references(NPQuote.M37.tableName, .id, onDelete: .cascade)
      )
      .field(.createdAt, .datetime, .required)
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: NarrowPath DOWN")
    try await database.schema(NPSentQuote.M38.tableName).delete()
    try await database.schema(NPQuote.M37.tableName).delete()
    try await database.schema(NPSubscriber.M36.tableName).delete()
  }
}

extension NPSubscriber {
  enum M36 {
    static let tableName = "np_subscribers"
    static let pendingConfirmationToken = FieldKey("pending_confirmation_token")
    static let lang = FieldKey("lang")
    static let email = FieldKey("email")
    static let mixedQuotes = FieldKey("mixed_quotes")
  }
}

extension NPQuote {
  enum M37 {
    static let tableName = "np_quotes"
    static let id = FieldKey("id")
    static let lang = FieldKey("lang")
    static let isFriend = FieldKey("is_friend")
    static let quote = FieldKey("quote")
    static let authorId = FieldKey("author_id")
    static let authorName = FieldKey("author_name")
    static let documentId = FieldKey("document_id")
  }
}

extension NPSentQuote {
  enum M38 {
    static let tableName = "np_sent_quotes"
    static let quoteId = FieldKey("quote_id")
  }
}
