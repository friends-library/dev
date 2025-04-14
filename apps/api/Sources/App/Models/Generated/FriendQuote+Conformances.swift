// auto-generated, do not edit
import DuetSQL
import Tagged

extension FriendQuote: ApiModel {
  typealias Id = Tagged<FriendQuote, UUID>
}

extension FriendQuote: Model {
  static let tableName = M13.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .friendId:
      .uuid(friendId)
    case .source:
      .string(source)
    case .text:
      .string(text)
    case .order:
      .int(order)
    case .context:
      .string(context)
    case .createdAt:
      .date(createdAt)
    case .updatedAt:
      .date(updatedAt)
    }
  }
}

extension FriendQuote {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case friendId
    case source
    case text
    case order
    case context
    case createdAt
    case updatedAt
  }
}

extension FriendQuote {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .friendId: .uuid(friendId),
      .source: .string(source),
      .text: .string(text),
      .order: .int(order),
      .context: .string(context),
      .createdAt: .currentTimestamp,
      .updatedAt: .currentTimestamp,
    ]
  }
}
