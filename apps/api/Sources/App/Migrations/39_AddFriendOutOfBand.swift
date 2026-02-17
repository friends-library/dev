import Fluent
import FluentSQL
import Vapor

struct AddFriendOutOfBand: AsyncMigration {
  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AddFriendOutOfBand UP")
    try await database.schema(Friend.M11.tableName)
      .field(Friend.M39.outOfBand, .bool, .required, .sql(.default(false)))
      .update()
    let sql = database as! SQLDatabase
    _ = try await sql.raw("""
    UPDATE friends SET out_of_band = true WHERE name = 'Gerhard Tersteegen'
    """).all()
    _ = try await sql.raw("""
    UPDATE editions SET editor = 'Samuel Jackson'
    WHERE document_id IN (
      SELECT id FROM documents WHERE friend_id IN (
        SELECT id FROM friends WHERE name = 'Gerhard Tersteegen'
      )
    )
    """).all()
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AddFriendOutOfBand DOWN")
    try await database.schema(Friend.M11.tableName)
      .deleteField(Friend.M39.outOfBand)
      .update()
  }
}

extension Friend {
  enum M39 {
    static let outOfBand = FieldKey("out_of_band")
  }
}
