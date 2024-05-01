import DuetSQL
import TaggedMoney

struct OrderItem: Codable, Sendable {
  var id: Id
  var orderId: Order.Id
  var editionId: Edition.Id
  var quantity: Int
  var unitPrice: Cents<Int>
  var createdAt = Current.date()

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
