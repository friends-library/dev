import XCTest
import XExpect

#if canImport(FoundationNetworking)
  import FoundationNetworking
#endif

@testable import App
@testable import XStripe

final class OrderResolverTests: AppTestCase {
  func orderSetup() async throws -> (CreateOrder.Input, OrderItem) {
    let entities = await Entities.create()
    let order = Order.random
    let item = OrderItem.random
    item.orderId = order.id
    item.editionId = entities.edition.id

    let input = CreateOrder.Input(
      id: order.id,
      lang: order.lang,
      source: order.source,
      paymentId: order.paymentId,
      amount: order.amount,
      taxes: order.taxes,
      fees: order.fees,
      ccFeeOffset: order.ccFeeOffset,
      shipping: order.shipping,
      shippingLevel: order.shippingLevel,
      email: order.email,
      addressName: order.addressName,
      addressStreet: order.addressStreet,
      addressStreet2: order.addressStreet2,
      addressCity: order.addressCity,
      addressState: order.addressState,
      addressZip: order.addressZip,
      addressCountry: order.addressCountry,
      freeOrderRequestId: order.freeOrderRequestId,
      items: [.init(
        editionId: item.editionId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      )]
    )

    return (input, item)
  }

  func testCreateOrder() async throws {
    let (input, item) = try await orderSetup()
    let output = try await CreateOrder.resolve(with: input, in: .mock)

    let retrieved = try await Order.find(output)
    let items = try await retrieved.items()

    expect(retrieved.id).toEqual(input.id)
    expect(retrieved.email).toEqual(input.email)
    expect(items).toHaveCount(1)
    expect(items.first?.editionId).toEqual(item.editionId)
  }

  func testCreateOrderHttpAuthAndStateAbbrev() async throws {
    var (input, _) = try await orderSetup()
    input.addressState = "California" // should be abbreviated
    input.addressCountry = "US"

    let badToken = UUID()
    var request = URLRequest(url: URL(string: "order/CreateOrder")!)
    request.httpMethod = "POST"
    request.addValue("Bearer \(badToken.lowercased)", forHTTPHeaderField: "Authorization")
    request.httpBody = try JSONEncoder().encode(input)

    var matched = try PairQLRoute.router.match(request: request)
    let expected = PairQLRoute.order(.createOrder(badToken, input))
    expect(matched).toEqual(expected)

    try await expectErrorFrom {
      try await PairQLRoute.respond(to: matched, in: .mock)
    }.toContain("notFound")

    let token = try await Token(description: "one-time", uses: 1).create()
    try await TokenScope(tokenId: token.id, scope: .mutateOrders).create()

    request.setValue("Bearer \(token.value.lowercased)", forHTTPHeaderField: "Authorization")
    matched = try PairQLRoute.router.match(request: request)

    let response = try await PairQLRoute.respond(to: matched, in: .mock)
    expect("\(response.body)").toEqual("\"\(input.id!.lowercased)\"")

    let retrieved = try await Order.find(input.id!)
    expect(retrieved.addressState).toEqual("CA")
  }

  func testCreateOrderWithUncapitalizedUsStateCapitalizes() async throws {
    var (input, _) = try await orderSetup()
    input.addressState = "Tx" // <-- lulu rejects this, needs "TX"
    input.addressCountry = "US"

    let token = try await Token(description: "one-time", uses: 1).create()
    try await TokenScope(tokenId: token.id, scope: .mutateOrders).create()

    var request = URLRequest(url: URL(string: "order/CreateOrder")!)
    request.httpMethod = "POST"
    request.httpBody = try JSONEncoder().encode(input)
    request.setValue("Bearer \(token.value.lowercased)", forHTTPHeaderField: "Authorization")

    let matched = try PairQLRoute.router.match(request: request)

    let response = try await PairQLRoute.respond(to: matched, in: .mock)
    expect("\(response.body)").toEqual("\"\(input.id!.lowercased)\"")

    let retrieved = try await Order.find(input.id!)
    expect(retrieved.addressState).toEqual("TX") // <-- capitalized
  }

  func testCreateOrderWithFreeRequestId() async throws {
    let req = try await Current.db.create(FreeOrderRequest.random)
    var (input, _) = try await orderSetup()
    input.freeOrderRequestId = req.id
    let output = try await CreateOrder.resolve(with: input, in: .mock)

    let retrieved = try await Order.find(output)

    expect(retrieved.freeOrderRequestId).toEqual(req.id)
  }

  func testBrickOrder() async throws {
    let order = Order.random
    order.printJobStatus = .presubmit
    order.paymentId = .init(rawValue: "stripe_pi_id")
    try await Current.db.create(order)

    var refundedPaymentIntentId: String?
    Current.stripeClient.createRefund = { pi, _ in
      refundedPaymentIntentId = pi
      return .init(id: "pi_refund_id")
    }

    var canceledPaymentId: String?
    Current.stripeClient.cancelPaymentIntent = { pi, _ in
      canceledPaymentId = pi
      return .init(id: pi, clientSecret: "")
    }

    let input = BrickOrder.Input(
      orderPaymentId: "stripe_pi_id",
      orderId: order.id.lowercased,
      userAgent: "operafox",
      stateHistory: ["foo", "bar"]
    )

    let output = try await BrickOrder.resolve(with: input, in: .mock)

    expect(output).toEqual(.success)

    let retrieved = try await Current.db.find(order.id)
    XCTAssertEqual(retrieved.printJobStatus, .bricked)
    XCTAssertEqual(refundedPaymentIntentId, "stripe_pi_id")
    XCTAssertEqual(canceledPaymentId, "stripe_pi_id")
    let orderId = order.id.lowercased
    XCTAssertEqual(
      sent.slacks,
      [
        .error("Created stripe refund `pi_refund_id` for bricked order `\(orderId)`"),
        .error("Canceled stripe payment intent `stripe_pi_id` for bricked order `\(orderId)`"),
        .error("Updated order `\(orderId)` to printJobStatus `.bricked`"),
        .error("""
        *Bricked Order*
        ```
        \(JSON.encode(
          BrickOrder.Input(
            orderPaymentId: "stripe_pi_id",
            orderId: orderId,
            userAgent: "operafox",
            stateHistory: ["foo", "bar"]
          ), .pretty)!)
        ```
        """),
      ]
    )
  }
}
