import DuetSQL
import Foundation
import Vapor
import XSendGrid
import XStripe

#if !DEBUG
  struct Environment: Sendable {
    let uuid: @Sendable () -> UUID = { UUID() }
    let date: @Sendable () -> Date = { Date() }
    var db: DuetSQL.Client = ThrowingClient()
    let deeplClient: DeepL.Client = .live
    var logger = Logger(label: "api.friendslibrary")
    let slackClient: FlpSlack.Client = .init()
    let luluClient: Lulu.Api.Client = .live
    let sendGridClient: SendGrid.Client.SlackErrorLogging = .live
    let stripeClient = Stripe.Client()
    let ipApiClient = IpApi.Client()
    let userAgentParser: UserAgentParser = .live
  }
#else
  struct Environment: Sendable {
    var uuid: @Sendable () -> UUID = { UUID() }
    var date: @Sendable () -> Date = { Date() }
    var db: DuetSQL.Client = ThrowingClient()
    var deeplClient: DeepL.Client = .live
    var logger = Logger(label: "api.friendslibrary")
    var slackClient: FlpSlack.Client = .init()
    var luluClient: Lulu.Api.Client = .live
    var sendGridClient: SendGrid.Client.SlackErrorLogging = .live
    var stripeClient = Stripe.Client()
    var ipApiClient = IpApi.Client()
    var userAgentParser: UserAgentParser = .live
  }
#endif

// SAFETY: in non-debug, ONLY `.db` and `.logger` are mutable
// and they are mutated only synchronously during bootstrapping
// before the app starts serving requests
nonisolated(unsafe) var Current = Environment()

extension UUID {
  static let mock = UUID("DEADBEEF-DEAD-BEEF-DEAD-DEADBEEFDEAD")!
}

func invariant(_ msg: String) -> Never {
  Current.slackClient.sendSync(.error(msg))
  fatalError(msg)
}
