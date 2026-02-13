// auto-generated, do not edit
import DuetSQL
import Tagged

extension EditionChapter: ApiModel {
  typealias Id = Tagged<EditionChapter, UUID>
}

extension EditionChapter: Model {
  static let tableName = M22.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .editionId:
      .uuid(editionId)
    case .order:
      .int(order)
    case .shortHeading:
      .string(shortHeading)
    case .isIntermediateTitle:
      .bool(isIntermediateTitle)
    case .customId:
      .string(customId)
    case .sequenceNumber:
      .int(sequenceNumber)
    case .nonSequenceTitle:
      .string(nonSequenceTitle)
    case .createdAt:
      .date(createdAt)
    case .updatedAt:
      .date(updatedAt)
    }
  }
}

extension EditionChapter {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable, ModelColumns {
    case id
    case editionId
    case order
    case shortHeading
    case isIntermediateTitle
    case customId
    case sequenceNumber
    case nonSequenceTitle
    case createdAt
    case updatedAt
  }
}

extension EditionChapter {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .editionId: .uuid(editionId),
      .order: .int(order),
      .shortHeading: .string(shortHeading),
      .isIntermediateTitle: .bool(isIntermediateTitle),
      .customId: .string(customId),
      .sequenceNumber: .int(sequenceNumber),
      .nonSequenceTitle: .string(nonSequenceTitle),
      .createdAt: .currentTimestamp,
      .updatedAt: .currentTimestamp,
    ]
  }
}
