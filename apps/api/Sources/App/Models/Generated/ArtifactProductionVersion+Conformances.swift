// auto-generated, do not edit
import DuetSQL
import Tagged

extension ArtifactProductionVersion: ApiModel {
  typealias Id = Tagged<ArtifactProductionVersion, UUID>
}

extension ArtifactProductionVersion: Model {
  static let tableName = M8.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .version:
      .string(version.rawValue)
    case .createdAt:
      .date(createdAt)
    }
  }
}

extension ArtifactProductionVersion {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case version
    case createdAt
  }
}

extension ArtifactProductionVersion {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .version: .string(version.rawValue),
      .createdAt: .currentTimestamp,
    ]
  }
}
