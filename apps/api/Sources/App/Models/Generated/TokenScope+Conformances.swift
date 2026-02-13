// auto-generated, do not edit
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
      .id(self)
    case .scope:
      .enum(scope)
    case .tokenId:
      .uuid(tokenId)
    case .createdAt:
      .date(createdAt)
    }
  }
}

extension TokenScope {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable, ModelColumns {
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
