import DuetSQL
import Foundation
import Vapor

#if !DEBUG
  struct Environment: Sendable {
    var db: DuetSQL.Client = ThrowingClient()
  }
#else
  struct Environment: Sendable {
    var db: DuetSQL.Client = ThrowingClient()
  }
#endif

// SAFETY: in non-debug, ONLY `.db` is mutable
// and it is mutated only synchronously during bootstrapping
// before the app starts serving requests
nonisolated(unsafe) var Current = Environment()
