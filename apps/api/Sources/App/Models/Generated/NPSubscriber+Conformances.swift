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
      .unsubscribedAt: .date(unsubscribedAt),
    ]
  }

  typealias Id = Tagged<NPSubscriber, UUID>
}

extension NPSubscriber: Model {
  static let tableName = M36.tableName

  func postgresData(for column: ColumnName) -> DuetSQL.Postgres.Data {
    switch column {
    case .createdAt:
      .date(createdAt)
    case .updatedAt:
      .date(updatedAt)
    case .unsubscribedAt:
      .date(unsubscribedAt)
    case .email:
      .string(email)
    case .id:
      .id(self)
    case .pendingConfirmationToken:
      .uuid(pendingConfirmationToken)
    case .lang:
      .enum(lang)
    case .mixedQuotes:
      .bool(mixedQuotes)
    }
  }
}

extension NPSubscriber {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable, ModelColumns {
    case id
    case email
    case createdAt
    case updatedAt
    case unsubscribedAt
    case pendingConfirmationToken
    case lang
    case mixedQuotes
  }
}
