import Foundation
import XHttp
import XSlack

extension FlpSlack {
  struct Client: Sendable {
    var send = send(_:)
  }
}

@Sendable private func send(_ slack: FlpSlack.Message) async {
  switch slack.channel {
  case .info, .orders, .downloads, .other:
    get(dependency: \.logger).info("Sent a slack to `\(slack.channel)`: \(slack.message.text)")
  case .errors:
    get(dependency: \.logger).error("Sent a slack to `\(slack.channel)`: \(slack.message.text)")
  case .audioDownloads, .debug:
    get(dependency: \.logger).debug("Sent a slack to `\(slack.channel)`: \(slack.message.text)")
  }

  guard Env.mode != .dev || Env.get("SLACK_DEV") != nil else { return }

  if let errMsg = await Slack.Client().send(slack.message, slack.channel.token) {
    get(dependency: \.logger).error("Failed to send slack, error=\(errMsg)")
  }
}
