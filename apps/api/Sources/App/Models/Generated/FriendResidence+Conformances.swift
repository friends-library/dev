// auto-generated, do not edit
import DuetSQL
import Tagged

extension FriendResidence: ApiModel {
  typealias Id = Tagged<FriendResidence, UUID>
}

extension FriendResidence: Model {
  static let tableName = M12.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .friendId:
      .uuid(friendId)
    case .city:
      .string(city)
    case .region:
      .string(region)
    case .createdAt:
      .date(createdAt)
    case .updatedAt:
      .date(updatedAt)
    }
  }
}

extension FriendResidence {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case friendId
    case city
    case region
    case createdAt
    case updatedAt
  }
}

extension FriendResidence {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .friendId: .uuid(friendId),
      .city: .string(city),
      .region: .string(region),
      .createdAt: .currentTimestamp,
      .updatedAt: .currentTimestamp,
    ]
  }
}
