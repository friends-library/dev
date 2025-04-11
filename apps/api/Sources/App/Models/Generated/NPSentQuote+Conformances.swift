import DuetSQL
import Foundation

extension NPSentQuote: ApiModel {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .quoteId: .uuid(quoteId),
      .createdAt: .currentTimestamp,
    ]
  }

  typealias Id = Tagged<NPSentQuote, UUID>
}

extension NPSentQuote: Model {
  static let tableName = M38.tableName

  func postgresData(for column: ColumnName) -> DuetSQL.Postgres.Data {
    switch column {
    case .createdAt:
      .date(createdAt)
    case .id:
      .id(self)
    case .quoteId:
      .uuid(quoteId)
    }
  }
}

extension NPSentQuote {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case createdAt
    case quoteId
  }
}
