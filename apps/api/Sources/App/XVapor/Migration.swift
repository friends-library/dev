import FluentSQL
import Vapor

public extension Migration {
  // doing the documented way of database.enum().case().update()
  // seems to only update _fluent_enums, without affecting underlying PG enum type
  // at least when doing multiple cases, so, we do it manually
  func addDbEnumCases(
    fixingPriorIncompleteMigration completingPriorMigration: Bool = false,
    db: Database,
    enumName: String,
    newCases: [String]
  ) async throws {
    if #available(macOS 12, *) {
      let sql = db as! SQLDatabase

      for newCase in newCases {
        if !completingPriorMigration {
          _ = try await sql.raw(
            """
            INSERT INTO "_fluent_enums"
            ("id", "name", "case")
            VALUES
            ('\(unsafeRaw: UUID().uuidString
              .lowercased())', '\(unsafeRaw: enumName)', '\(unsafeRaw: newCase)');
            """
          ).all()
        }

        _ = try await sql
          .raw("ALTER TYPE \(unsafeRaw: enumName) ADD VALUE '\(unsafeRaw: newCase)';").all()
      }
    }
  }

  func renameColumn(
    in tableName: String,
    from oldColumn: FieldKey,
    to newColumn: FieldKey,
    on database: Database
  ) async throws {
    if #available(macOS 12, *) {
      let sql = database as! SQLDatabase
      _ = try await sql.raw(
        """
        ALTER TABLE "\(unsafeRaw: tableName)"
        RENAME COLUMN "\(unsafeRaw: oldColumn.description)" TO "\(unsafeRaw: newColumn
          .description)";
        """
      ).all()
    }
  }
}
