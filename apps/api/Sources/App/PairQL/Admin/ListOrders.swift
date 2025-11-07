import Foundation
import PairQL
import TaggedMoney

struct ListOrders: Pair {
  static let auth: Scope = .queryOrders

  struct OrderOutput: PairOutput {
    let id: Order.Id
    let amountInCents: Cents<Int>
    let addressName: String
    let printJobStatus: Order.PrintJobStatus
    let source: Order.OrderSource
    let createdAt: Date
  }

  typealias Output = [OrderOutput]
}

extension ListOrders: NoInputResolver {
  static func resolve(in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    let orders = try await Order.query().all()
    return orders.map { order in
      .init(
        id: order.id,
        amountInCents: order.amount,
        addressName: order.addressName,
        printJobStatus: order.printJobStatus,
        source: order.source,
        createdAt: order.createdAt,
      )
    }
  }
}
