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
    execSend = send

    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    dateFormatter = formatter

    state = LockIsolated(State())
  }

  func send(_ slack: FlpSlack.Message) async {
    var state = state.value
    let today = dateFormatter.string(from: Current.date())
    switch state.currentDay {

    // first time initializing
    case nil:
      state = .init(currentDay: today)
      await execSend(slack)

    // new day
    case .some(let day) where day != today:
      let msg = "Sent `\(state.numSent)/\(state.numAttempted)` attempted slacks on `\(day)`"
      await execSend(.info(msg)) // TODO: change to debug after observing a while
      state = .init(currentDay: today)
      await execSend(slack)

    default:
      state.numAttempted += 1

      // over daily limit
      if state.numAttempted >= dailyLimit {
        if state.numAttempted - 1 < dailyLimit {
          await execSend(.error("Exceeded daily slack limit"))
          try? await Current.sendGridClient.send(.init(
            to: .init(email: Env.JARED_CONTACT_FORM_EMAIL),
            from: "noreply@friendslibrary.com",
            subject: "[FLP Api] Exceeded daily slack limit",
            text: "See server logs for dropped slacks"
          ))
        }
        drop(slack)

        // at 90% of daily limit
      } else if state.numAttempted >= dailyLimit * 9 / 10 {
        if state.numAttempted - 1 < dailyLimit * 9 / 10 {
          await execSend(.error("Exceeded 90% of daily slack limit"))
        }
        switch slack.channel {
        case .debug, .audioDownloads, .downloads:
          drop(slack)
        case .info where slack.message.text.contains("Unusual missing location"):
          drop(slack)
        case .info, .errors, .orders, .other:
          state.numSent += 1
          await execSend(slack)
        }

        // at 80% of daily limit
      } else if state.numAttempted >= dailyLimit * 8 / 10 {
        if state.numAttempted - 1 < dailyLimit * 8 / 10 {
          await execSend(.error("Exceeded 80% of daily slack limit"))
        }
        switch slack.channel {
        case .debug, .audioDownloads, .downloads:
          drop(slack)
        case .info, .errors, .orders, .other:
          state.numSent += 1
          await execSend(slack)
        }

        // under all limits
      } else {
        state.numSent += 1
        await execSend(slack)
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
