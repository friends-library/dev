import Foundation
import PairQL
import TaggedMoney

struct GetOrderInvoice: Pair {
  typealias Input = Order.Id

  struct Output: PairOutput {
    struct Item: PairNestable {
      var title: String
      var authorName: String
      var isbn: String?
      var quantity: Int
      var unitPriceInCents: Cents<Int>
      var editionType: EditionType
    }

    var id: Order.Id
    var lang: Lang
    var source: Order.OrderSource
    var createdAt: Date
    var email: EmailAddress
    var address: ShippingAddress
    var paymentId: Order.PaymentId
    var printJobStatus: Order.PrintJobStatus
    var amountInCents: Cents<Int>
    var shippingInCents: Cents<Int>
    var taxesInCents: Cents<Int>
    var feesInCents: Cents<Int>
    var ccFeeOffsetInCents: Cents<Int>
    var items: [Item]
  }
}

extension GetOrderInvoice: Resolver {
  static func resolve(with input: Input, in context: Context) async throws -> Output {
    let order = try await context.db.find(input)
    let items = try await order.items(in: context.db)
    return try await .init(
      id: order.id,
      lang: order.lang,
      source: order.source,
      createdAt: order.createdAt,
      email: order.email,
      address: order.address,
      paymentId: order.paymentId,
      printJobStatus: order.printJobStatus,
      amountInCents: order.amount,
      shippingInCents: order.shipping,
      taxesInCents: order.taxes,
      feesInCents: order.fees,
      ccFeeOffsetInCents: order.ccFeeOffset,
      items: items.concurrentMap { item in
        let edition = try await Edition.Joined.find(item.editionId)
        return .init(
          title: edition.document.utf8ShortTitle,
          authorName: edition.document.friend.name,
          isbn: edition.isbn?.code.rawValue,
          quantity: item.quantity,
          unitPriceInCents: item.unitPrice,
          editionType: edition.type,
        )
      },
    )
  }
}
