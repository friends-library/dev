import DuetSQL
import Tagged

extension TokenScope: ApiModel {
  typealias Id = Tagged<TokenScope, UUID>
}

extension TokenScope: Model {
  static let tableName = M5.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      return .id(self)
    case .scope:
      return .enum(scope)
    case .tokenId:
      return .uuid(tokenId)
    case .createdAt:
      return .date(createdAt)
    }
  }
}

extension TokenScope {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case scope
    case tokenId
    case createdAt
  }
}

extension TokenScope {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .scope: .enum(scope),
      .tokenId: .uuid(tokenId),
      .createdAt: .currentTimestamp,
    ]
  }
}
