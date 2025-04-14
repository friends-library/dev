// auto-generated, do not edit
import DuetSQL
import Tagged

extension OrderItem: ApiModel {
  typealias Id = Tagged<OrderItem, UUID>
}

extension OrderItem: Model {
  static let tableName = M3.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .orderId:
      .uuid(orderId)
    case .editionId:
      .uuid(editionId)
    case .quantity:
      .int(quantity)
    case .unitPrice:
      .int(unitPrice.rawValue)
    case .createdAt:
      .date(createdAt)
    }
  }
}

extension OrderItem {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case orderId
    case editionId
    case quantity
    case unitPrice
    case createdAt
  }
}

extension OrderItem {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .orderId: .uuid(orderId),
      .editionId: .uuid(editionId),
      .quantity: .int(quantity),
      .unitPrice: .int(unitPrice.rawValue),
      .createdAt: .currentTimestamp,
    ]
  }
}
