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

struct FooClient: DuetSQL.Client {
  func update<M>(_ model: M) async throws -> M where M: DuetSQL.Model {
    fatalError()
  }

  func create<M>(_ models: [M]) async throws -> [M] where M: DuetSQL.Model {
    fatalError()
  }

  func customQuery<T>(
    _ Custom: T.Type,
    withBindings: [DuetSQL.Postgres.Data]?
  ) async throws -> [T]
    where T: DuetSQL.CustomQueryable {
    fatalError()
  }

  func select<M>(
    _ Model: M.Type,
    where: DuetSQL.SQL.WhereConstraint<M>,
    orderBy: DuetSQL.SQL.Order<M>?,
    limit: Int?,
    offset: Int?,
    withSoftDeleted: Bool
  ) async throws -> [M] where M: DuetSQL.Model {
    fatalError()
  }

  func count<M>(
    _: M.Type,
    where: DuetSQL.SQL.WhereConstraint<M>,
    withSoftDeleted: Bool
  ) async throws -> Int where M: DuetSQL.Model {
    fatalError()
  }

  func delete<M>(
    _ Model: M.Type,
    where constraints: DuetSQL.SQL.WhereConstraint<M>,
    orderBy order: DuetSQL.SQL.Order<M>?,
    limit: Int?,
    offset: Int?
  ) async throws -> [M] where M: DuetSQL.Model {
    fatalError()
  }

  func forceDelete<M>(
    _ Model: M.Type,
    where: DuetSQL.SQL.WhereConstraint<M>,
    orderBy: DuetSQL.SQL.Order<M>?,
    limit: Int?,
    offset: Int?
  ) async throws -> [M] where M: DuetSQL.Model {
    fatalError()
  }
}
