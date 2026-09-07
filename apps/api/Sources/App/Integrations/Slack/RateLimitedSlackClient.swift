import ConcurrencyExtras
import Foundation

struct RateLimitedSlackClient: Sendable {
  private struct State {
    var currentDay: String?
    var numSent = 1
    var numAttempted = 1
  }

  private struct SendPlan {
    var slacks: [FlpSlack.Message]
    var droppedSlack: FlpSlack.Message?
    var sendsLimitEmail = false
  }

  private let dailyLimit: Int
  private let state: LockIsolated<State>
  private let dateFormatter: DateFormatter
  private let execSend: @Sendable (FlpSlack.Message) async -> Void

  init(
    dailyLimit: Int = 2000,
    send: @escaping @Sendable (FlpSlack.Message) async -> Void,
  ) {
    self.dailyLimit = dailyLimit
    self.execSend = send

    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM-dd"
    self.dateFormatter = formatter

    self.state = LockIsolated(State())
  }

  func send(_ slack: FlpSlack.Message) async {
    let plan = self.state.withValue { state in
      let today = self.dateFormatter.string(from: get(dependency: \.date.now))
      switch state.currentDay {
      case nil:
        state = .init(currentDay: today)
        return SendPlan(slacks: [slack])

      case .some(let day) where day != today:
        let summary = "Sent `\(state.numSent)/\(state.numAttempted)` attempted slacks on `\(day)`"
        state = .init(currentDay: today)
        return SendPlan(slacks: [.debug(summary), slack])

      default:
        state.numAttempted += 1

        if state.numAttempted >= self.dailyLimit {
          let reachedLimit = state.numAttempted == self.dailyLimit
          return SendPlan(
            slacks: reachedLimit ? [.error("Exceeded daily slack limit")] : [],
            droppedSlack: slack,
            sendsLimitEmail: reachedLimit,
          )
        }

        if state.numAttempted >= self.dailyLimit * 9 / 10 {
          var slacks: [FlpSlack.Message] = state.numAttempted == self.dailyLimit * 9 / 10
            ? [.error("Exceeded 90% of daily slack limit")]
            : []
          switch slack.channel {
          case .debug, .audioDownloads, .downloads:
            return SendPlan(slacks: slacks, droppedSlack: slack)
          case .info where slack.message.text.contains("Unusual missing location"):
            return SendPlan(slacks: slacks, droppedSlack: slack)
          case .info, .errors, .orders, .other:
            state.numSent += 1
            slacks.append(slack)
            return SendPlan(slacks: slacks)
          }
        }

        if state.numAttempted >= self.dailyLimit * 8 / 10 {
          var slacks: [FlpSlack.Message] = state.numAttempted == self.dailyLimit * 8 / 10
            ? [.error("Exceeded 80% of daily slack limit")]
            : []
          switch slack.channel {
          case .debug, .audioDownloads, .downloads:
            return SendPlan(slacks: slacks, droppedSlack: slack)
          case .info, .errors, .orders, .other:
            state.numSent += 1
            slacks.append(slack)
            return SendPlan(slacks: slacks)
          }
        }

        state.numSent += 1
        return SendPlan(slacks: [slack])
      }
    }

    for slack in plan.slacks {
      await self.execSend(slack)
    }
    if plan.sendsLimitEmail {
      await get(dependency: \.postmarkClient).send(.init(
        to: Env.JARED_CONTACT_FORM_EMAIL,
        from: "info@friendslibrary.com",
        subject: "[FLP Api] Exceeded daily slack limit",
        textBody: "See server logs for dropped slacks",
      ))
    }
    if let droppedSlack = plan.droppedSlack {
      self.drop(droppedSlack)
    }
  }

  func drop(_ slack: FlpSlack.Message) {
    get(dependency: \.logger)
      .error("Dropped rate-limited Slack to `\(slack.channel)`: \(slack.message.text)")
  }
}
