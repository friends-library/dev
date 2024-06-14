import DuetSQL
import Foundation

extension NPQuote: ApiModel {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .lang: .enum(lang),
      .isFriend: .bool(isFriend),
      .quote: .string(quote),
      .authorId: .uuid(authorId),
      .authorName: .string(authorName),
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
    case .createdAt:
      return .date(createdAt)
    case .updatedAt:
      return .date(updatedAt)
    case .id:
      return .id(self)
    case .lang:
      return .enum(lang)
    case .isFriend:
      return .bool(isFriend)
    case .quote:
      return .string(quote)
    case .authorId:
      return .uuid(authorId)
    case .authorName:
      return .string(authorName)
    case .documentId:
      return .uuid(documentId)
    }
  }
}

extension NPQuote {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case createdAt
    case updatedAt
    case lang
    case isFriend
    case quote
    case authorId
    case authorName
    case documentId
  }
}
