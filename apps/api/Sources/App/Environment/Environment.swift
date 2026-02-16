import DuetSQL
import Foundation
import Vapor
import XPostmark

#if !DEBUG
  struct Environment: Sendable {
    var db: DuetSQL.Client = ThrowingClient()
    var logger = Logger(label: "api.friendslibrary")
    var postmarkClient: XPostmark.Client.SlackErrorLogging = .live
  }
#else
  struct Environment: Sendable {
    var db: DuetSQL.Client = ThrowingClient()
    var logger = Logger(label: "api.friendslibrary")
    var postmarkClient: XPostmark.Client.SlackErrorLogging = .live
  }
#endif

// SAFETY: in non-debug, ONLY `.db` and `.logger` are mutable
// and they are mutated only synchronously during bootstrapping
// before the app starts serving requests
nonisolated(unsafe) var Current = Environment()
