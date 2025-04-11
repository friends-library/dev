// auto-generated, do not edit
import DuetSQL
import Tagged

extension Document: ApiModel {
  typealias Id = Tagged<Document, UUID>
}

extension Document: Model {
  static let tableName = M14.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .friendId:
      .uuid(friendId)
    case .altLanguageId:
      .uuid(altLanguageId)
    case .title:
      .string(title)
    case .slug:
      .string(slug)
    case .filename:
      .string(filename)
    case .published:
      .int(published)
    case .originalTitle:
      .string(originalTitle)
    case .incomplete:
      .bool(incomplete)
    case .description:
      .string(description)
    case .partialDescription:
      .string(partialDescription)
    case .featuredDescription:
      .string(featuredDescription)
    case .createdAt:
      .date(createdAt)
    case .updatedAt:
      .date(updatedAt)
    case .deletedAt:
      .date(deletedAt)
    }
  }
}

extension Document {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case friendId
    case altLanguageId
    case title
    case slug
    case filename
    case published
    case originalTitle
    case incomplete
    case description
    case partialDescription
    case featuredDescription
    case createdAt
    case updatedAt
    case deletedAt
  }
}

extension Document {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .friendId: .uuid(friendId),
      .altLanguageId: .uuid(altLanguageId),
      .title: .string(title),
      .slug: .string(slug),
      .filename: .string(filename),
      .published: .int(published),
      .originalTitle: .string(originalTitle),
      .incomplete: .bool(incomplete),
      .description: .string(description),
      .partialDescription: .string(partialDescription),
      .featuredDescription: .string(featuredDescription),
      .createdAt: .currentTimestamp,
      .updatedAt: .currentTimestamp,
    ]
  }
}
