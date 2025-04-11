// auto-generated, do not edit
import DuetSQL
import Tagged

extension FriendResidenceDuration: ApiModel {
  typealias Id = Tagged<FriendResidenceDuration, UUID>
}

extension FriendResidenceDuration: Model {
  static let tableName = M25.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .friendResidenceId:
      .uuid(friendResidenceId)
    case .start:
      .int(start)
    case .end:
      .int(end)
    case .createdAt:
      .date(createdAt)
    }
  }
}

extension FriendResidenceDuration {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case friendResidenceId
    case start
    case end
    case createdAt
  }
}

extension FriendResidenceDuration {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .friendResidenceId: .uuid(friendResidenceId),
      .start: .int(start),
      .end: .int(end),
      .createdAt: .currentTimestamp,
    ]
  }
}
