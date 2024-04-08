import Fluent
import Vapor

struct AddNPSubscribers: AsyncMigration {
  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: AddSubscribers UP")
    let lang = try await database.enum(Order.M2.LangEnum.name).read()
    try await database.schema(NPSubscriber.M35.tableName)
      .id()
      .field(NPSubscriber.M35.email, .string, .required)
      .field(NPSubscriber.M35.confirmationToken, .uuid)
      .field(NPSubscriber.M35.lang, lang, .required)
      .field(NPSubscriber.M35.nonFriendQuotesOptIn, .bool, .required)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .unique(on: NPSubscriber.M35.email)
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: AddSubscribers DOWN")
    try await database.schema(NPSubscriber.M35.tableName).delete()
  }
}

extension NPSubscriber {
  enum M35 {
    static let tableName = "np_subscribers"
    static let confirmationToken = FieldKey("confirmation_token")
    static let lang = FieldKey("lang")
    static let email = FieldKey("email")
    static let nonFriendQuotesOptIn = FieldKey("non_friend_quotes_opt_in")
  }
}
