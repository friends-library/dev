// auto-generated, do not edit
import DuetSQL
import Tagged

extension Friend: ApiModel {
  typealias Id = Tagged<Friend, UUID>
}

extension Friend: Model {
  static let tableName = M11.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .lang:
      .enum(lang)
    case .name:
      .string(name)
    case .slug:
      .string(slug)
    case .gender:
      .enum(gender)
    case .description:
      .string(description)
    case .born:
      .int(born)
    case .died:
      .int(died)
    case .published:
      .date(published)
    case .createdAt:
      .date(createdAt)
    case .updatedAt:
      .date(updatedAt)
    case .deletedAt:
      .date(deletedAt)
    }
  }
}

extension Friend {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable, ModelColumns {
    case id
    case lang
    case name
    case slug
    case gender
    case description
    case born
    case died
    case published
    case createdAt
    case updatedAt
    case deletedAt
  }
}

extension Friend {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .lang: .enum(lang),
      .name: .string(name),
      .slug: .string(slug),
      .gender: .enum(gender),
      .description: .string(description),
      .born: .int(born),
      .died: .int(died),
      .published: .date(published),
      .createdAt: .currentTimestamp,
      .updatedAt: .currentTimestamp,
    ]
  }
}
