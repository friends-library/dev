import DuetSQL
import Foundation

extension NPQuote: ApiModel {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .lang: .enum(lang),
      .isFriend: .bool(isFriend),
      .authorName: .string(authorName),
      .quote: .string(quote),
      .friendId: .uuid(friendId),
      .documentId: .uuid(documentId),
      .createdAt: .currentTimestamp,
      .updatedAt: .currentTimestamp,
    ]
  }

  typealias Id = Tagged<NPQuote, UUID>
}

extension NPQuote: Model {
  static let tableName = M37.tableName

  func postgresData(for column: ColumnName) -> DuetSQL.Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .lang:
      .enum(lang)
    case .isFriend:
      .bool(isFriend)
    case .authorName:
      .string(authorName)
    case .quote:
      .string(quote)
    case .friendId:
      .uuid(friendId)
    case .documentId:
      .uuid(documentId)
    case .createdAt:
      .date(createdAt)
    case .updatedAt:
      .date(updatedAt)
    }
  }
}

extension NPQuote {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable, ModelColumns {
    case id
    case lang
    case isFriend
    case authorName
    case quote
    case friendId
    case documentId
    case createdAt
    case updatedAt
  }
}
