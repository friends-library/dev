import PairQL
import TaggedMoney
import Vapor

struct InitOrder: Pair {
  typealias Input = Cents<Int>

  struct Output: PairOutput {
    var orderId: Order.Id
    var orderPaymentId: Order.PaymentId
    var stripeClientSecret: String
    var createOrderToken: Token.Value
  }
}

// resolver

extension InitOrder: Resolver {
  static func resolve(with input: Input, in context: Context) async throws -> Output {
    let orderId = Order.Id()
    do {
      async let pi = Current.stripeClient.createPaymentIntent(
        input.rawValue, .USD,
        ["orderId": orderId.lowercased],
        Env.STRIPE_SECRET_KEY
      )
      let tokenDesc = "single-use create order token for order `\(orderId.lowercased)`"
      async let token = Current.db.create(Token(description: tokenDesc, uses: 1))
      try await TokenScope(tokenId: try await token.id, scope: .mutateOrders).create()
      return .init(
        orderId: orderId,
        orderPaymentId: .init(rawValue: try await pi.id),
        stripeClientSecret: try await pi.clientSecret,
        createOrderToken: try await token.value
      )
    } catch {
      await slackError("InitOrder error: \(String(describing: error))")
      throw Abort(.internalServerError)
    }
  }
}
