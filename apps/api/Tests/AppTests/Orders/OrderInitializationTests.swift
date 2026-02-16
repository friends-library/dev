import Dependencies
import XCTest
import XExpect

@testable import App
@testable import XStripe

final class OrderInitializationTests: AppTestCase, @unchecked Sendable {
  func testCreateOrderInitializationSuccess() async throws {
    try await Current.db.delete(all: Token.self)

    let uuids = MockUUIDs()

    Current.stripeClient.createPaymentIntent = { amount, currency, metadata, _ in
      expect(amount).toEqual(555)
      expect(currency).toEqual(.USD)
      expect(metadata).toEqual(["orderId": uuids.first.lowercased])
      return .init(id: "pi_id", clientSecret: "pi_secret")
    }

    let output = try await withDependencies {
      $0.uuid = .mock(uuids)
    } operation: {
      try await InitOrder.resolve(with: 555, in: .mock)
    }

    expect(output).toEqual(InitOrder.Output(
      orderId: .init(uuids.first),
      orderPaymentId: "pi_id",
      stripeClientSecret: "pi_secret",
      createOrderToken: .init(uuids.third),
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
