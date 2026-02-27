import DuetSQL
import FluentSQL
import Vapor

struct AudioSizeBigInt: AsyncMigration {
  var columns: [(String, FieldKey)] {
    [
      (Audio.M20.tableName, Audio.M20.mp3ZipSizeHq),
      (Audio.M20.tableName, Audio.M20.mp3ZipSizeLq),
      (Audio.M20.tableName, Audio.M20.m4bSizeHq),
      (Audio.M20.tableName, Audio.M20.m4bSizeLq),
    ]
  }

  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AudioSizeBigInt UP")
    let sql = database as! SQLDatabase
    for (table, column) in self.columns {
      try await sql.execute(
        """
        ALTER TABLE \(unsafeRaw: table)
        ALTER COLUMN "\(unsafeRaw: column.description)" TYPE BIGINT
        """,
      )
    }
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AudioSizeBigInt DOWN")
    let sql = database as! SQLDatabase
    for (table, column) in self.columns {
      try await sql.execute(
        """
        ALTER TABLE \(unsafeRaw: table)
        ALTER COLUMN "\(unsafeRaw: column.description)" TYPE INTEGER
        """,
      )
    }
  }
}
