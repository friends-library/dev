import DuetSQL
import PairQL
import TaggedMoney
import Vapor

struct CreateOrder: Pair {
  struct Input: PairInput {
    struct Item: PairNestable {
      var editionId: Edition.Id
      var quantity: Int
      var unitPrice: Cents<Int>
    }

    var id: Order.Id?
    var lang: Lang
    var source: Order.OrderSource
    var paymentId: Order.PaymentId
    var amount: Cents<Int>
    var taxes: Cents<Int>
    var fees: Cents<Int>
    var ccFeeOffset: Cents<Int>
    var shipping: Cents<Int>
    var shippingLevel: Order.ShippingLevel
    var email: EmailAddress
    var addressName: String
    var addressStreet: String
    var addressStreet2: String?
    var addressCity: String
    var addressState: String
    var addressZip: String
    var addressCountry: String
    var freeOrderRequestId: FreeOrderRequest.Id?
    var recipientTaxId: String?
    var items: [Item]
  }

  typealias Output = Order.Id
}

// resolver

extension CreateOrder: Resolver {
  static func resolve(with input: Input, in context: Context) async throws -> Output {
    let order = Order(input)
    let items = input.items.map { OrderItem($0, orderId: order.id) }
    try await order.create()
    try await items.create()
    return order.id
  }
}

// authentication

extension CreateOrder {
  static func authenticate(with value: Token.Value) async throws {
    var token = try await Token.query().where(.value == value).first()
    let scopes = try await token.scopes()
    guard scopes.can(.mutateOrders) else {
      throw Abort(.unauthorized)
    }
    if let remaining = token.uses {
      if remaining < 2 {
        try await token.delete()
      } else {
        token.uses = remaining - 1
        try await token.save()
      }
    }
  }
}

extension Order {
  init(_ input: CreateOrder.Input) {
    self.init(
      id: input.id ?? .init(),
      lang: input.lang,
      source: input.source,
      paymentId: input.paymentId,
      printJobStatus: .presubmit,
      amount: input.amount,
      taxes: input.taxes,
      fees: input.fees,
      ccFeeOffset: input.ccFeeOffset,
      shipping: input.shipping,
      shippingLevel: input.shippingLevel,
      email: input.email,
      addressName: input.addressName,
      addressStreet: input.addressStreet,
      addressStreet2: input.addressStreet2,
      addressCity: input.addressCity,
      addressState: input.addressState,
      addressZip: input.addressZip,
      addressCountry: input.addressCountry,
      freeOrderRequestId: input.freeOrderRequestId,
      recipientTaxId: input.recipientTaxId
    )
  }
}

extension OrderItem {
  init(_ input: CreateOrder.Input.Item, orderId: Order.Id) {
    self.init(
      orderId: orderId,
      editionId: input.editionId,
      quantity: input.quantity,
      unitPrice: input.unitPrice
    )
  }
}
