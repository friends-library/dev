import DuetSQL
import Foundation

extension NPSubscriber: ApiModel {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .email: .string(email),
      .lang: .enum(lang),
      .confirmationToken: .uuid(confirmationToken),
      .nonFriendQuotesOptIn: .bool(nonFriendQuotesOptIn),
      .createdAt: .currentTimestamp,
      .updatedAt: .currentTimestamp,
    ]
  }

  typealias Id = Tagged<NPSubscriber, UUID>
}

extension NPSubscriber: Model {
  static var tableName = M36.tableName

  func postgresData(for column: ColumnName) -> DuetSQL.Postgres.Data {
    switch column {
    case .createdAt:
      return .date(createdAt)
    case .updatedAt:
      return .date(updatedAt)
    case .email:
      return .string(email)
    case .id:
      return .id(self)
    case .confirmationToken:
      return .uuid(confirmationToken)
    case .lang:
      return .enum(lang)
    case .nonFriendQuotesOptIn:
      return .bool(nonFriendQuotesOptIn)
    }
  }
}

extension NPSubscriber {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case email
    case createdAt
    case updatedAt
    case confirmationToken
    case lang
    case nonFriendQuotesOptIn
  }
}
