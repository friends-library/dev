import Fluent
import Vapor

struct CreateFriendResidences: Migration {
  private typealias M12 = FriendResidence.M12

  func prepare(on database: Database) -> Future<Void> {
    Current.logger.info("Running migration: CreateFriendResidences UP")
    return database.schema(M12.tableName)
      .id()
      .field(
        M12.friendId,
        .uuid,
        .required,
        .references(Friend.M11.tableName, .id, onDelete: .cascade),
      )
      .field(M12.city, .string, .required)
      .field(M12.region, .string, .required)
      .field(M12.duration, .dictionary)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .create()
  }

  func revert(on database: Database) -> Future<Void> {
    Current.logger.info("Running migration: CreateFriendResidences DOWN")
    return database.schema(M12.tableName).delete()
  }
}
