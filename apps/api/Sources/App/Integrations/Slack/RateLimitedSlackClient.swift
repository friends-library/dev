import ConcurrencyExtras
#if os(Linux)
  @preconcurrency import Foundation
#else
  import Foundation
#endif

struct RateLimitedSlackClient: Sendable {
  private struct State {
    var currentDay: String?
    var numSent = 1
    var numAttempted = 1
  }

  private let dailyLimit: Int
  private let state: LockIsolated<State>
  private let dateFormatter: DateFormatter
  private let execSend: @Sendable (FlpSlack.Message) async -> Void

  init(
    dailyLimit: Int = 2000,
    send: @escaping @Sendable (FlpSlack.Message) async -> Void
  ) {
    self.dailyLimit = dailyLimit
    self.execSend = send

    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    self.dateFormatter = formatter

    self.state = LockIsolated(State())
  }

  func send(_ slack: FlpSlack.Message) async {
    var state = state.value
    let today = self.dateFormatter.string(from: Current.date())
    switch state.currentDay {

    // first time initializing
    case nil:
      state = .init(currentDay: today)
      await self.execSend(slack)

    // new day
    case .some(let day) where day != today:
      let msg = "Sent `\(state.numSent)/\(state.numAttempted)` attempted slacks on `\(day)`"
      await self.execSend(.debug(msg))
      state = .init(currentDay: today)
      await self.execSend(slack)

    default:
      state.numAttempted += 1

      // over daily limit
      if state.numAttempted >= self.dailyLimit {
        if state.numAttempted - 1 < self.dailyLimit {
          await self.execSend(.error("Exceeded daily slack limit"))
          await Current.postmarkClient.send(.init(
            to: Env.JARED_CONTACT_FORM_EMAIL,
            from: "info@friendslibrary.com",
            subject: "[FLP Api] Exceeded daily slack limit",
            textBody: "See server logs for dropped slacks"
          ))
        }
        self.drop(slack)

        // at 90% of daily limit
      } else if state.numAttempted >= self.dailyLimit * 9 / 10 {
        if state.numAttempted - 1 < self.dailyLimit * 9 / 10 {
          await self.execSend(.error("Exceeded 90% of daily slack limit"))
        }
        switch slack.channel {
        case .debug, .audioDownloads, .downloads:
          self.drop(slack)
        case .info where slack.message.text.contains("Unusual missing location"):
          self.drop(slack)
        case .info, .errors, .orders, .other:
          state.numSent += 1
          await self.execSend(slack)
        }

        // at 80% of daily limit
      } else if state.numAttempted >= self.dailyLimit * 8 / 10 {
        if state.numAttempted - 1 < self.dailyLimit * 8 / 10 {
          await self.execSend(.error("Exceeded 80% of daily slack limit"))
        }
        switch slack.channel {
        case .debug, .audioDownloads, .downloads:
          self.drop(slack)
        case .info, .errors, .orders, .other:
          state.numSent += 1
          await self.execSend(slack)
        }

        // under all limits
      } else {
        state.numSent += 1
        await self.execSend(slack)
      }
    }

    let updatedState = state
    self.state.setValue(updatedState)
  }

  func drop(_ slack: FlpSlack.Message) {
    Current.logger
      .error("Dropped rate-limited Slack to `\(slack.channel)`: \(slack.message.text)")
  }
}
