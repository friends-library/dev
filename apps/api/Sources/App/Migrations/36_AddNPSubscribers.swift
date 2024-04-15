import Fluent
import Vapor

struct AddNPSubscribers: AsyncMigration {
  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: AddSubscribers UP")
    let lang = try await database.enum(Order.M2.LangEnum.name).read()
    try await database.schema(NPSubscriber.M36.tableName)
      .id()
      .field(NPSubscriber.M36.email, .string, .required)
      .field(NPSubscriber.M36.confirmationToken, .uuid)
      .field(NPSubscriber.M36.lang, lang, .required)
      .field(NPSubscriber.M36.nonFriendQuotesOptIn, .bool, .required)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .unique(on: NPSubscriber.M36.email)
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: AddSubscribers DOWN")
    try await database.schema(NPSubscriber.M36.tableName).delete()
  }
}

extension NPSubscriber {
  enum M36 {
    static let tableName = "np_subscribers"
    static let confirmationToken = FieldKey("confirmation_token")
    static let lang = FieldKey("lang")
    static let email = FieldKey("email")
    static let nonFriendQuotesOptIn = FieldKey("non_friend_quotes_opt_in")
  }
}
