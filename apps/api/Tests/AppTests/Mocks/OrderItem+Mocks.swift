@testable import App

extension OrderItem {
  static var mock: OrderItem {
    OrderItem(orderId: .init(), editionId: .init(), quantity: 42, unitPrice: 42)
  }

  static var empty: OrderItem {
    OrderItem(orderId: .init(), editionId: .init(), quantity: 0, unitPrice: 0)
  }

  static var random: OrderItem {
    OrderItem(
      orderId: .init(),
      editionId: .init(),
      quantity: Int.random,
      unitPrice: .init(rawValue: Int.random),
    )
  }
}
