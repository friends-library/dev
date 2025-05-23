import Foundation
import PairQL
import TaggedMoney

struct GetOrder: Pair {
  static let auth: Scope = .queryOrders

  typealias Input = Order.Id

  struct Output: PairOutput {
    struct Item: PairNestable {
      struct Edition: PairNestable {
        struct Image: PairNestable {
          var width: Int
          var height: Int
          var url: String
        }

        var type: EditionType
        var documentTitle: String
        var authorName: String
        var image: Image
      }

      var id: OrderItem.Id
      var quantity: Int
      var unitPriceInCents: Cents<Int>
      var edition: Edition
    }

    var id: Order.Id
    var printJobStatus: Order.PrintJobStatus
    var printJobId: Order.PrintJobId?
    var amountInCents: Cents<Int>
    var shippingInCents: Cents<Int>
    var taxesInCents: Cents<Int>
    var ccFeeOffsetInCents: Cents<Int>
    var feesInCents: Cents<Int>
    var paymentId: Order.PaymentId
    var email: EmailAddress
    var lang: Lang
    var source: Order.OrderSource
    var items: [Item]
    var address: ShippingAddress
    var createdAt: Date
  }
}

extension GetOrder: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    let order = try await Order.find(input)
    let items = try await order.items()
    return try await .init(
      id: order.id,
      printJobStatus: order.printJobStatus,
      printJobId: order.printJobId,
      amountInCents: order.amount,
      shippingInCents: order.shipping,
      taxesInCents: order.taxes,
      ccFeeOffsetInCents: order.ccFeeOffset,
      feesInCents: order.fees,
      paymentId: order.paymentId,
      email: order.email,
      lang: order.lang,
      source: order.source,
      items: items.concurrentMap { item in
        let edition = try await Edition.Joined.find(item.editionId)
        return .init(
          id: item.id,
          quantity: item.quantity,
          unitPriceInCents: item.unitPrice,
          edition: .init(
            type: edition.type,
            documentTitle: edition.document.utf8ShortTitle,
            authorName: edition.document.friend.name,
            image: .init(
              width: edition.images.threeD.w250.width,
              height: edition.images.threeD.w250.height,
              url: edition.images.threeD.w250.url.absoluteString
            )
          )
        )
      },
      address: order.address,
      createdAt: order.createdAt
    )
  }
}
