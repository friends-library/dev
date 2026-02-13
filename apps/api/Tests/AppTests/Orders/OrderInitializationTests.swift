import XCTest
import XExpect

@testable import App
@testable import XStripe

final class OrderInitializationTests: AppTestCase, @unchecked Sendable {
  func testCreateOrderInitializationSuccess() async throws {
    try await Current.db.delete(all: Token.self)

    let (orderId, _, tokenValue) = mockUUIDs()

    Current.stripeClient.createPaymentIntent = { amount, currency, metadata, _ in
      expect(amount).toEqual(555)
      expect(currency).toEqual(.USD)
      expect(metadata).toEqual(["orderId": orderId.lowercased])
      return .init(id: "pi_id", clientSecret: "pi_secret")
    }

    let output = try await InitOrder.resolve(with: 555, in: .mock)

    expect(output).toEqual(InitOrder.Output(
      orderId: .init(orderId),
      orderPaymentId: "pi_id",
      stripeClientSecret: "pi_secret",
      createOrderToken: .init(tokenValue),
    ))
  }

  func testCreateOrderInitializationFailure() async throws {
    Current.stripeClient.createPaymentIntent = { _, _, _, _ in throw "some error" }

    try await expectErrorFrom {
      try await InitOrder.resolve(with: 555, in: .mock)
    }.toContain("500")

    expect(sent.slacks).toEqual([.error("InitOrder error: some error")])
  }
}

extension Context {
  static var mock: Self {
    .init(requestId: "mock-req-id")
  }
}
