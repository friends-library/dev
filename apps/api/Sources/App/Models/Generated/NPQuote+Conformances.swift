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
      return .id(self)
    case .lang:
      return .enum(lang)
    case .isFriend:
      return .bool(isFriend)
    case .authorName:
      return .string(authorName)
    case .quote:
      return .string(quote)
    case .friendId:
      return .uuid(friendId)
    case .documentId:
      return .uuid(documentId)
    case .createdAt:
      return .date(createdAt)
    case .updatedAt:
      return .date(updatedAt)
    }
  }
}

extension NPQuote {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
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
