import DuetSQL
import Foundation
import Vapor
import XSendGrid
import XStripe

struct Environment: @unchecked Sendable {
  var uuid: () -> UUID = UUID.init
  var date: () -> Date = Date.init
  var db: DuetSQL.Client = ThrowingClient()
  var logger = Logger(label: "api.friendslibrary")
  var slackClient: FlpSlack.Client = .init()
  var luluClient: Lulu.Api.Client = .live
  var sendGridClient: SendGrid.Client.SlackErrorLogging = .live
  var stripeClient = Stripe.Client()
  var ipApiClient = IpApi.Client()
  var userAgentParser: UserAgentParser = .live
}

// concurrency todo
nonisolated(unsafe) var Current = Environment()

extension UUID {
  static let mock = UUID("DEADBEEF-DEAD-BEEF-DEAD-DEADBEEFDEAD")!
}

func invariant(_ msg: String) -> Never {
  Current.slackClient.sendSync(.error(msg))
  fatalError(msg)
}
