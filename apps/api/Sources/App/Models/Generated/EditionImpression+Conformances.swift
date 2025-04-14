// auto-generated, do not edit
import DuetSQL
import Tagged

extension EditionImpression: ApiModel {
  typealias Id = Tagged<EditionImpression, UUID>
}

extension EditionImpression: Model {
  static let tableName = M18.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .editionId:
      .uuid(editionId)
    case .adocLength:
      .int(adocLength)
    case .paperbackSizeVariant:
      .enum(paperbackSizeVariant)
    case .paperbackVolumes:
      .intArray(paperbackVolumes.array)
    case .publishedRevision:
      .string(publishedRevision.rawValue)
    case .productionToolchainRevision:
      .string(productionToolchainRevision.rawValue)
    case .createdAt:
      .date(createdAt)
    }
  }
}

extension EditionImpression {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case editionId
    case adocLength
    case paperbackSizeVariant
    case paperbackVolumes
    case publishedRevision
    case productionToolchainRevision
    case createdAt
  }
}

extension EditionImpression {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .editionId: .uuid(editionId),
      .adocLength: .int(adocLength),
      .paperbackSizeVariant: .enum(paperbackSizeVariant),
      .paperbackVolumes: .intArray(paperbackVolumes.array),
      .publishedRevision: .string(publishedRevision.rawValue),
      .productionToolchainRevision: .string(productionToolchainRevision.rawValue),
      .createdAt: .currentTimestamp,
    ]
  }
}
