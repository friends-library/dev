import ConcurrencyExtras
import Dependencies
import FluentSQL
import Vapor
import XCTest
import XPostmark

@testable import App
@testable import DuetSQL

class AppTestCase: XCTestCase, @unchecked Sendable {
  @Dependency(\.db) var db

  override func invokeTest() {
    withDependencies {
      $0.uuid = UUIDGenerator { UUID() }
      $0.date = .constant(Date())
      $0.slackClient = RateLimitedSlackClient { [self] in sent.slacks.append($0) }
      $0.postmarkClient = .init(
        send: { [self] in sent.emails.append($0) },
        sendTemplateEmail: { [self] in sent.templateEmails.append($0) },
        sendTemplateEmailBatch: { [self] in
          sent.templateEmails.append(contentsOf: $0)
          return .success([])
        },
        deleteSuppression: { _, _ in .success(()) },
      )
    } operation: {
      super.invokeTest()
    }
  }

  nonisolated(unsafe) static var migrated = false

  struct Sent {
    var slacks: [FlpSlack.Message] = []
    var emails: [XPostmark.Email] = []
    var templateEmails: [XPostmark.TemplateEmail] = []
  }

  nonisolated(unsafe) static var app: Application!
  var sent = Sent()

  var app: Application {
    Self.app
  }

  override static func setUp() {
    setenv("WEBSITE_URL_EN", "https://friendslibrary.com", 1)
    setenv("WEBSITE_URL_ES", "https://bibliotecadelosamigos.org", 1)
    self.app = Application(.testing)
    try! Configure.app(self.app)
    self.app.logger = .null
    if !self.migrated {
      try! self.app.autoRevert().wait()
      try! self.app.autoMigrate().wait()
      self.migrated = true
    }
  }

  override static func tearDown() {
    self.app.shutdown()
  }

  override func setUp() async throws {
    await JoinedEntityCache.shared.flush()
    await LegacyRest.cachedData.flush()
  }
}

extension UUIDGenerator {
  static func mock(_ uuids: MockUUIDs) -> Self {
    Self { uuids() }
  }
}

struct MockUUIDs: Sendable {
  private var stack: LockIsolated<[UUID]>
  private var copy: LockIsolated<[UUID]>

  var first: UUID { self.copy[0] }
  var second: UUID { self.copy[1] }
  var third: UUID { self.copy[2] }

  init() {
    let uuids = [UUID(), UUID(), UUID(), UUID(), UUID(), UUID()]
    self.stack = .init(uuids)
    self.copy = .init(uuids)
  }

  func callAsFunction() -> UUID {
    self.stack.withValue { $0.removeFirst() }
  }

  subscript(index: Int) -> UUID {
    self.copy[index]
  }
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
  _ f: @Sendable @escaping () async throws -> Void,
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

func withUUID<T: Sendable>(
  _ f: @Sendable () async throws -> T,
) async rethrows -> T {
  try await withDependencies { $0.uuid = .init { UUID() } } operation: {
    try await f()
  }
}

public extension Date {
  static let epoch = Date(timeIntervalSince1970: 0)
  static let reference = Date(timeIntervalSinceReferenceDate: 0)
}

#if DEBUG && os(macOS)
  import Darwin

  func eprint(_ items: Any...) {
    let s = items.map { "\($0)" }.joined(separator: " ")
    fputs(s + "\n", stderr)
    fflush(stderr)
  }
#endif
