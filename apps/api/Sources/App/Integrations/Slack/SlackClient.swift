import Foundation
import XHttp
import XSlack

extension FlpSlack {
  struct Client {
    var send = send(_:)
    var sendSync = sendSync(_:)
  }
}

private func send(_ slack: FlpSlack.Message) async {
  switch slack.channel {
  case .info, .orders, .downloads, .other:
    Current.logger.info("Sent a slack to `\(slack.channel)`: \(slack.message.text)")
  case .errors:
    Current.logger.error("Sent a slack to `\(slack.channel)`: \(slack.message.text)")
  case .audioDownloads, .debug:
    Current.logger.debug("Sent a slack to `\(slack.channel)`: \(slack.message.text)")
  }

  guard Env.mode != .dev || Env.get("SLACK_DEV") != nil else { return }

  if let errMsg = await Slack.Client().send(slack.message, slack.channel.token) {
    Current.logger.error("Failed to send slack, error=\(errMsg)")
  }
}

private func sendSync(_ slack: FlpSlack.Message) {
  let semaphore = DispatchSemaphore(value: 0)
  Task {
    await send(slack)
    semaphore.signal()
  }
  // this appears to deadlock if we have only one cpu/thread...
  _ = semaphore.wait(timeout: .now() + 3)
}

// extensions

extension FlpSlack.Client {
  static let mock = FlpSlack.Client(send: { _ in }, sendSync: { _ in })
}
