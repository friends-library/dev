// auto-generated, do not edit
import DuetSQL
import Tagged

extension Edition: ApiModel {
  typealias Id = Tagged<Edition, UUID>
}

extension Edition: Model {
  static let tableName = M17.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .documentId:
      .uuid(documentId)
    case .type:
      type.postgresData
    case .editor:
      .string(editor)
    case .isDraft:
      .bool(isDraft)
    case .paperbackSplits:
      .intArray(paperbackSplits?.array)
    case .paperbackOverrideSize:
      paperbackOverrideSize.postgresData
    case .createdAt:
      .date(createdAt)
    case .updatedAt:
      .date(updatedAt)
    case .deletedAt:
      .date(deletedAt)
    }
  }
}

extension Edition {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable, ModelColumns {
    case id
    case documentId
    case type
    case editor
    case isDraft
    case paperbackSplits
    case paperbackOverrideSize
    case createdAt
    case updatedAt
    case deletedAt
  }
}

extension Edition {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .documentId: .uuid(documentId),
      .type: type.postgresData,
      .editor: .string(editor),
      .isDraft: .bool(isDraft),
      .paperbackSplits: .intArray(paperbackSplits?.array),
      .paperbackOverrideSize: paperbackOverrideSize.postgresData,
      .createdAt: .currentTimestamp,
      .updatedAt: .currentTimestamp,
    ]
  }
}
