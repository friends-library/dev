import DuetSQL
import TaggedMoney

struct OrderItem: Codable, Sendable {
  var id: Id
  var orderId: Order.Id
  var editionId: Edition.Id
  var quantity: Int
  var unitPrice: Cents<Int>
  var createdAt = Current.date()

  var order = Parent<Order>.notLoaded
  var edition = Parent<Edition>.notLoaded

  var isValid: Bool { true }

  init(
    id: Id = .init(),
    orderId: Order.Id,
    editionId: Edition.Id,
    quantity: Int,
    unitPrice: Cents<Int>
  ) {
    self.id = id
    self.orderId = orderId
    self.editionId = editionId
    self.quantity = quantity
    self.unitPrice = unitPrice
  }
}

// loaders

extension OrderItem {
  mutating func edition() async throws -> Edition {
    try await edition.useLoaded(or: {
      try await Edition.query()
        .where(.id == editionId)
        .first()
    })
  }
}
