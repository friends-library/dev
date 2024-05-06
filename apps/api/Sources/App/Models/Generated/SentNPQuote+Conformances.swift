import DuetSQL
import Foundation

extension SentNPQuote: ApiModel {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .quoteId: .uuid(quoteId),
      .createdAt: .currentTimestamp,
    ]
  }

  typealias Id = Tagged<SentNPQuote, UUID>
}

extension SentNPQuote: Model {
  static var tableName = M38.tableName

  func postgresData(for column: ColumnName) -> DuetSQL.Postgres.Data {
    switch column {
    case .createdAt:
      return .date(createdAt)
    case .id:
      return .id(self)
    case .quoteId:
      return .uuid(quoteId)
    }
  }
}

extension SentNPQuote {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case createdAt
    case quoteId
  }
}
