import Fluent

struct CreateOrderItems: AsyncMigration {
  private typealias M3 = OrderItem.M3

  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: CreateOrderItems UP")
    let editionType = try await database.enum(Download.M1.EditionTypeEnum.name).read()
    try await database.schema(M3.tableName)
      .id()
      .field(
        M3.orderId,
        .uuid,
        .required,
        .references(Order.M2.tableName, .id, onDelete: .cascade),
      )
      .field(M3.title, .string, .required)
      .field(M3.documentId, .uuid, .required)
      .field(M3.editionType, editionType, .required)
      .field(M3.quantity, .int, .required)
      .field(M3.unitPrice, .int, .required)
      .field(M3.createdAt, .datetime, .required)
      .create()
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: CreateOrderItems DOWN")
    try await database.schema(M3.tableName).delete()
  }
}

// extensions

extension OrderItem {
  enum M3 {
    static let tableName = "order_items"
    static let orderId = FieldKey("order_id")
    static let title = FieldKey("title")
    static let documentId = FieldKey("document_id")
    static let editionType = FieldKey("edition_type")
    static let quantity = FieldKey("quantity")
    static let unitPrice = FieldKey("unit_price")
    static let createdAt = FieldKey("created_at")
  }
}
