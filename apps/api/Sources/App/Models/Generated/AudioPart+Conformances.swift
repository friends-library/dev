// auto-generated, do not edit
import DuetSQL
import Tagged

extension AudioPart: ApiModel {
  typealias Id = Tagged<AudioPart, UUID>
}

extension AudioPart: Model {
  static let tableName = M21.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .audioId:
      .uuid(audioId)
    case .title:
      .string(title)
    case .duration:
      .double(duration.rawValue)
    case .chapters:
      .intArray(chapters.array)
    case .order:
      .int(order)
    case .mp3SizeHq:
      .int(mp3SizeHq.rawValue)
    case .mp3SizeLq:
      .int(mp3SizeLq.rawValue)
    case .createdAt:
      .date(createdAt)
    case .updatedAt:
      .date(updatedAt)
    }
  }
}

extension AudioPart {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case audioId
    case title
    case duration
    case chapters
    case order
    case mp3SizeHq
    case mp3SizeLq
    case createdAt
    case updatedAt
  }
}

extension AudioPart {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .audioId: .uuid(audioId),
      .title: .string(title),
      .duration: .double(duration.rawValue),
      .chapters: .intArray(chapters.array),
      .order: .int(order),
      .mp3SizeHq: .int(mp3SizeHq.rawValue),
      .mp3SizeLq: .int(mp3SizeLq.rawValue),
      .createdAt: .currentTimestamp,
      .updatedAt: .currentTimestamp,
    ]
  }
}
