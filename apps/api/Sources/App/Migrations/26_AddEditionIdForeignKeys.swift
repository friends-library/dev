import Fluent
import FluentSQL

struct AddEditionIdForeignKeys: AsyncMigration {
  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AddEditionIdForeignKeys UP")
    let sql = database as! SQLDatabase

    _ = try await sql.raw(
      """
      ALTER TABLE \(unsafeRaw: OrderItem.M3.tableName)
      ADD CONSTRAINT \(unsafeRaw: M26.orderItemsEditionIdForeignKey)
      FOREIGN KEY (\(unsafeRaw: OrderItem.M10.editionId.description))
      REFERENCES \(unsafeRaw: Edition.M17.tableName) (id)
      ON DELETE NO ACTION;
      """,
    ).all()

    _ = try await sql.raw(
      """
      ALTER TABLE \(unsafeRaw: Download.M1.tableName)
      ADD CONSTRAINT \(unsafeRaw: M26.downloadsEditionIdForeignKey)
      FOREIGN KEY (\(unsafeRaw: Download.M10.editionId.description))
      REFERENCES \(unsafeRaw: Edition.M17.tableName) (id)
      ON DELETE NO ACTION;
      """,
    ).all()
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AddEditionIdForeignKeys DOWN")
    let sql = database as! SQLDatabase

    _ = try await sql.raw(
      """
      ALTER TABLE \(unsafeRaw: OrderItem.M3.tableName)
      DROP CONSTRAINT \(unsafeRaw: M26.orderItemsEditionIdForeignKey);
      """,
    ).all()

    _ = try await sql.raw(
      """
      ALTER TABLE \(unsafeRaw: Download.M1.tableName)
      DROP CONSTRAINT \(unsafeRaw: M26.downloadsEditionIdForeignKey);
      """,
    ).all()
  }
}

extension AddEditionIdForeignKeys {
  enum M26 {
    static let orderItemsEditionIdForeignKey = "order_items_edition_id_fkey"
    static let downloadsEditionIdForeignKey = "downloads_edition_id_fkey"
  }
}
