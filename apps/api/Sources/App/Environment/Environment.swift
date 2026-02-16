import DuetSQL
import Foundation
import Vapor
import XPostmark
import XStripe

#if !DEBUG
  struct Environment: Sendable {
    var db: DuetSQL.Client = ThrowingClient()
    let deeplClient: DeepL.Client = .live
    let cloudflareClient: CloudflareClient = .live
    var logger = Logger(label: "api.friendslibrary")
    var postmarkClient: XPostmark.Client.SlackErrorLogging = .live
    let slackClient: RateLimitedSlackClient = .init(send: FlpSlack.Client().send)
    let luluClient: Lulu.Api.Client = .live
    let stripeClient = Stripe.Client()
    let ipApiClient = IpApi.Client()
    let userAgentParser: UserAgentParser = .live
  }
#else
  struct Environment: Sendable {
    var db: DuetSQL.Client = ThrowingClient()
    var deeplClient: DeepL.Client = .live
    var cloudflareClient: CloudflareClient = .live
    var logger = Logger(label: "api.friendslibrary")
    var postmarkClient: XPostmark.Client.SlackErrorLogging = .live
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
