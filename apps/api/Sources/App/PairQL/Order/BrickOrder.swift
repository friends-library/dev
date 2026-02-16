import Foundation
import PairQL

struct BrickOrder: Pair {
  struct Input: PairInput {
    let orderPaymentId: String?
    let orderId: String?
    let userAgent: String?
    let stateHistory: [String]?
  }
}

// resolver

extension BrickOrder: Resolver {
  static func resolve(with input: Input, in context: Context) async throws -> Output {
    let forOrder = "for bricked order `\(input.orderId ?? "<no order id>")`"
    if let paymentIntentId = input.orderPaymentId, !paymentIntentId.isEmpty {
      do {
        let refund = try await get(dependency: \.stripe).createRefund(
          paymentIntentId,
          Env.STRIPE_SECRET_KEY,
        )
        await slackError("Created stripe refund `\(refund.id)` \(forOrder)")
      } catch {
        await slackError("Error creating refund \(forOrder): `\(error)`")
      }
      do {
        let pi = try await get(dependency: \.stripe).cancelPaymentIntent(
          paymentIntentId,
          Env.STRIPE_SECRET_KEY,
        )
        await slackError("Canceled stripe payment intent `\(pi.id)` \(forOrder)")
      } catch {
        await slackError("Error cancelling payment intent (expected) \(forOrder): `\(error)`")
      }
    }
    if let rawId = input.orderId, let orderId = UUID(uuidString: rawId) {
      do {
        var order = try await Current.db.find(Order.Id(rawValue: orderId))
        order.printJobStatus = .bricked
        try await Current.db.update(order)
        await slackError("Updated order `\(rawId)` to printJobStatus `.bricked`")
      } catch {
        await slackError("Failed to update order `\(rawId)` to printJobStatus `.bricked`")
      }
    }

    await slackError("""
    *Bricked Order*
    ```
    \(JSON.encode(input, .pretty) ?? String(describing: input))
    ```
    """)
    return .success
  }
}
