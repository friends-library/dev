import DuetSQL
import Foundation

extension NPSubscriber: ApiModel {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .email: .string(email),
      .lang: .enum(lang),
      .pendingConfirmationToken: .uuid(pendingConfirmationToken),
      .mixedQuotes: .bool(mixedQuotes),
      .createdAt: .currentTimestamp,
      .updatedAt: .currentTimestamp,
    ]
  }

  typealias Id = Tagged<NPSubscriber, UUID>
}

extension NPSubscriber: Model {
  static let tableName = M36.tableName

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
    case .pendingConfirmationToken:
      return .uuid(pendingConfirmationToken)
    case .lang:
      return .enum(lang)
    case .mixedQuotes:
      return .bool(mixedQuotes)
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
    case pendingConfirmationToken
    case lang
    case mixedQuotes
  }
}
