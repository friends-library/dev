// auto-generated, do not edit
import DuetSQL
import Tagged

extension Audio: ApiModel {
  typealias Id = Tagged<Audio, UUID>
}

extension Audio: Model {
  static let tableName = M20.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      return .id(self)
    case .editionId:
      return .uuid(editionId)
    case .reader:
      return .string(reader)
    case .isIncomplete:
      return .bool(isIncomplete)
    case .mp3ZipSizeHq:
      return .int(mp3ZipSizeHq.rawValue)
    case .mp3ZipSizeLq:
      return .int(mp3ZipSizeLq.rawValue)
    case .m4bSizeHq:
      return .int(m4bSizeHq.rawValue)
    case .m4bSizeLq:
      return .int(m4bSizeLq.rawValue)
    case .createdAt:
      return .date(createdAt)
    case .updatedAt:
      return .date(updatedAt)
    }
  }
}

extension Audio {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case editionId
    case reader
    case isIncomplete
    case mp3ZipSizeHq
    case mp3ZipSizeLq
    case m4bSizeHq
    case m4bSizeLq
    case createdAt
    case updatedAt
  }
}

extension Audio {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .editionId: .uuid(editionId),
      .reader: .string(reader),
      .isIncomplete: .bool(isIncomplete),
      .mp3ZipSizeHq: .int(mp3ZipSizeHq.rawValue),
      .mp3ZipSizeLq: .int(mp3ZipSizeLq.rawValue),
      .m4bSizeHq: .int(m4bSizeHq.rawValue),
      .m4bSizeLq: .int(m4bSizeLq.rawValue),
      .createdAt: .currentTimestamp,
      .updatedAt: .currentTimestamp,
    ]
  }
}
