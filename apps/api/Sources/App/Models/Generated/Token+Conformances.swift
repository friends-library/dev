// auto-generated, do not edit
import DuetSQL
import Tagged

extension Token: ApiModel {
  typealias Id = Tagged<Token, UUID>
}

extension Token: Model {
  static let tableName = M4.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .value:
      .uuid(value)
    case .description:
      .string(description)
    case .uses:
      .int(uses)
    case .createdAt:
      .date(createdAt)
    }
  }
}

extension Token {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable, ModelColumns {
    case id
    case value
    case description
    case uses
    case createdAt
  }
}

extension Token {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .value: .uuid(value),
      .description: .string(description),
      .uses: .int(uses),
      .createdAt: .currentTimestamp,
    ]
  }
}
