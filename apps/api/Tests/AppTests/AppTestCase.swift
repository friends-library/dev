import ConcurrencyExtras
import FluentSQL
import Vapor
import XCTest
import XPostmark

@testable import App
@testable import DuetSQL

class AppTestCase: XCTestCase {
  static var migrated = false

  struct Sent {
    var slacks: [FlpSlack.Message] = []
    var emails: [XPostmark.Email] = []
  }

  static var app: Application!
  var sent = Sent()

  var app: Application {
    Self.app
  }

  override static func setUp() {
    app = Application(.testing)
    Current = .mock
    Current.uuid = { UUID() }
    try! Configure.app(app)
    Current.db = FlushingDbClient(app.db as! SQLDatabase)
    Current.logger = .null
    app.logger = .null
    if !migrated {
      try! app.autoRevert().wait()
      try! app.autoMigrate().wait()
      migrated = true
    }
  }

  override static func tearDown() {
    app.shutdown()
    sync { await SQL.resetPreparedStatements() }
  }

  override func setUp() {
    Current.uuid = { UUID() }
    Current.date = { Date() }
    Current.slackClient = RateLimitedSlackClient { [self] in sent.slacks.append($0) }
    Current.postmarkClient.send = { [self] in sent.emails.append($0) }
  }
}

func mockUUIDs() -> (UUID, UUID, UUID) {
  let uuids = (UUID(), UUID(), UUID())
  let array = LockIsolated([uuids.0, uuids.1, uuids.2])

  Current.uuid = {
    array.withValue { array in
      guard !array.isEmpty else { return UUID() }
      return array.removeFirst()
    }
  }

  return uuids
}

public extension String {
  var random: String { "\(self)@random-\(Int.random)" }
}

public extension Int {
  // postgres ints are Int32, so keep max below Int32.max
  static var random: Int { Int.random(in: 1_000_000 ... 9_999_999) }
}

public extension Int64 {
  // postgres ints are Int32, so keep max below Int32.max
  static var random: Int64 { Int64.random(in: 1_000_000 ... 9_999_999) }
}

func sync(
  function: StaticString = #function,
  line: UInt = #line,
  column: UInt = #column,
  _ f: @escaping () async throws -> Void
) {
  let exp = XCTestExpectation(description: "sync:\(function):\(line):\(column)")
  Task {
    do {
      try await f()
      exp.fulfill()
    } catch {
      fatalError("Error awaiting \(exp.description) -- \(error)")
    }
  }
  switch XCTWaiter.wait(for: [exp], timeout: 10) {
  case .completed:
    return
  case .timedOut:
    fatalError("Timed out waiting for \(exp.description)")
  default:
    fatalError("Unexpected result waiting for \(exp.description)")
  }
}

#if DEBUG && os(macOS)
  import Darwin

  func eprint(_ items: Any...) {
    let s = items.map { "\($0)" }.joined(separator: " ")
    fputs(s + "\n", stderr)
    fflush(stderr)
  }
#endif
