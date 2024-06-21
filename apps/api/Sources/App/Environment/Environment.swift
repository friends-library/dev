import DuetSQL
import Foundation
import Vapor
import XPostmark
import XStripe

#if !DEBUG
  struct Environment: Sendable {
    let uuid: @Sendable () -> UUID = { UUID() }
    let date: @Sendable () -> Date = { Date() }
    var db: DuetSQL.Client = ThrowingClient()
    let deeplClient: DeepL.Client = .live
    var logger = Logger(label: "api.friendslibrary")
    var postmarkClient: XPostmark.Client.SlackErrorLogging = .live
    let randomNumberGenerator: @Sendable ()
      -> any RandomNumberGenerator = { SystemRandomNumberGenerator() }
    let slackClient: RateLimitedSlackClient = .init(send: FlpSlack.Client().send)
    let luluClient: Lulu.Api.Client = .live
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
    var postmarkClient: XPostmark.Client.SlackErrorLogging = .live
    var randomNumberGenerator: @Sendable ()
      -> any RandomNumberGenerator = { SystemRandomNumberGenerator() }
    var slackClient: RateLimitedSlackClient = .init(send: FlpSlack.Client().send)
    var luluClient: Lulu.Api.Client = .live
    var stripeClient = Stripe.Client()
    var ipApiClient = IpApi.Client()
    var userAgentParser: UserAgentParser = .live
  }
#endif

// SAFETY: in non-debug, ONLY `.db` and `.logger` are mutable
// and they are mutated only synchronously during bootstrapping
// before the app starts serving requests
nonisolated(unsafe) var Current = Environment()
