import ConcurrencyExtras
import Vapor
import XCTest
import XExpect

@testable import App

final class RateLimitedSlackClientTests: AppTestCase {
  func testRateLimitedClient() async throws {
    Current.date = { Date(timeIntervalSince1970: 0) }

    let sent = ActorIsolated<[String]>([])
    let client = RateLimitedSlackClient(dailyLimit: 20, send: { slack in
      await sent.withValue { $0.append("\(slack.message.text) (\(slack.channel))") }
    })

    let handler = MockLogger()
    let logged = handler.logged
    Current.logger = Logger(label: "mock") { _, _ in handler }

    func clearMocks() async {
      await sent.withValue { $0.removeAll() }
      logged.withValue { $0.removeAll() }
    }

    var expected: [String] = []
    for i in 0 ..< 15 {
      await client.send(.init(text: "msg \(i + 1)", channel: .debug))
      expected.append("msg \(i + 1) (debug)")
    }

    // below 80% of daily limit, all messages go through
    await expect(sent.value).toEqual(expected)
    await clearMocks()

    // next message goes over 80%
    await client.send(.init(text: "msg 16", channel: .debug))
    // ...so does not send debug, only slacks an error about reaching 80%...
    await expect(sent.value).toEqual(["Exceeded 80% of daily slack limit (errors)"])
    // ...and logs the drop
    expect(logged.value).toEqual(["Dropped rate-limited Slack to `debug`: msg 16"])
    await clearMocks()

    // .info is still allowed
    await client.send(.init(text: "msg 17", channel: .info))
    await expect(sent.value).toEqual(["msg 17 (info)"])
    await clearMocks()

    // now we go over 90%, not dropping one to .info
    await client.send(.init(text: "msg 18", channel: .info))
    await expect(sent.value).toEqual([
      "Exceeded 90% of daily slack limit (errors)",
      "msg 18 (info)",
    ])
    await clearMocks()

    // but now we drop "unusual ip missing location" messages
    await client.send(.init(text: "Unusual missing location data:\n```foo\n```", channel: .info))
    await expect(sent.value).toEqual([])
    expect(logged.value).toEqual(
      ["Dropped rate-limited Slack to `info`: Unusual missing location data:\n```foo\n```"]
    )
    await clearMocks()

    // now we're at 100%
    await client.send(.init(text: "msg 20", channel: .errors))
    // so we only send the error slack
    await expect(sent.value).toEqual(["Exceeded daily slack limit (errors)"])
    // and log the drop
    expect(logged.value).toEqual(["Dropped rate-limited Slack to `errors`: msg 20"])
    // and send an email
    expect(self.sent.emails.count).toEqual(1)
    expect(self.sent.emails.first?.subject).toEqual("[FLP Api] Exceeded daily slack limit")
    await clearMocks()

    // now we're over the limit, so we drop everything
    await client.send(.init(text: "msg 21", channel: .errors))
    await client.send(.init(text: "msg 22", channel: .info))
    await client.send(.init(text: "msg 23", channel: .orders))
    await client.send(.init(text: "msg 24", channel: .other("foo")))
    await client.send(.init(text: "msg 25", channel: .debug))
    await client.send(.init(text: "msg 26", channel: .audioDownloads))
    await client.send(.init(text: "msg 27", channel: .downloads))
    await expect(sent.value).toEqual([])
    expect(logged.value.count).toEqual(7)
    await clearMocks()

    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    let dayString = formatter.string(from: Current.date())

    // but then the day changes, so we reset the limit
    Current.date = { Date(timeIntervalSince1970: 86401) }
    await client.send(.init(text: "msg 28", channel: .info))
    await expect(sent.value).toEqual([
      "Sent `17/27` attempted slacks on `\(dayString)` (debug)",
      "msg 28 (info)",
    ])
  }
}

struct MockLogger: LogHandler {
  let logged: LockIsolated<[String]> = .init([])

  public func log(
    level: Logger.Level,
    message: Logger.Message,
    metadata: Logger.Metadata?,
    source: String,
    file: String,
    function: String,
    line: UInt
  ) {
    self.logged.withValue { $0.append(message.description) }
  }

  var metadata: Logging.Logger.Metadata { get { .init() } set {} }
  var logLevel: Logging.Logger.Level { get { .info } set {} }
  subscript(metadataKey _: String) -> Logging.Logger.Metadata.Value? {
    get { nil }
    set(newValue) {}
  }
}
