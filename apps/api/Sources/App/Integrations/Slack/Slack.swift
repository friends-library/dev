import Foundation
import XSlack

enum FlpSlack {
  struct Message: Equatable, Sendable {
    enum Channel {
      case errors
      case info
      case orders
      case downloads
      case audioDownloads
      case debug
      case other(String)

      var string: String {
        switch self {
        case .errors:
          "#errors"
        case .info:
          "#info"
        case .orders:
          "#orders"
        case .downloads:
          "#downloads"
        case .audioDownloads:
          "#audio-downloads"
        case .debug:
          "#debug"
        case .other(let channel):
          channel
        }
      }

      var token: String {
        if Env.mode == .staging || Env.mode == .dev {
          return Env.SLACK_API_TOKEN_WORKSPACE_BOT
        }
        switch self {
        case .debug, .audioDownloads:
          return Env.SLACK_API_TOKEN_WORKSPACE_BOT
        case .errors, .info, .orders, .downloads, .other:
          return Env.SLACK_API_TOKEN_WORKSPACE_MAIN
        }
      }
    }

    let channel: Channel
    let message: Slack.Message

    init(
      text: String,
      channel: Channel,
      emoji: Slack.Emoji = .robotFace,
      username: String = "FLP Bot"
    ) {
      self.channel = channel
      self.message = .init(
        text: text,
        channel: channel.string,
        username: username,
        emoji: emoji
      )
    }

    init(
      blocks: [Slack.Message.Content.Block],
      fallbackText: String,
      channel: Channel,
      emoji: Slack.Emoji = .robotFace,
      username: String = "FLP Bot"
    ) {
      self.channel = channel
      self.message = .init(
        blocks: blocks,
        fallbackText: fallbackText,
        channel: channel.string,
        username: username,
        emoji: emoji
      )
    }
  }
}

// extensions

extension FlpSlack.Message {
  static func error(_ text: String, emoji: Slack.Emoji = .fireEngine) -> FlpSlack.Message {
    .init(text: text, channel: .errors, emoji: emoji)
  }

  static func info(_ text: String, emoji: Slack.Emoji = .robotFace) -> FlpSlack.Message {
    .init(text: text, channel: .info, emoji: emoji)
  }

  static func order(_ text: String, emoji: Slack.Emoji = .books) -> FlpSlack.Message {
    .init(text: text, channel: .orders, emoji: emoji)
  }

  static func download(_ text: String, emoji: Slack.Emoji = .robotFace) -> FlpSlack.Message {
    .init(text: text, channel: .downloads, emoji: emoji)
  }

  static func audio(_ text: String, emoji: Slack.Emoji = .robotFace) -> FlpSlack.Message {
    .init(text: text, channel: .audioDownloads, emoji: emoji)
  }

  static func debug(_ text: String, emoji: Slack.Emoji = .robotFace) -> FlpSlack.Message {
    .init(text: text, channel: .debug, emoji: emoji)
  }
}

func slackError(_ msg: String) async {
  await Current.slackClient.send(.error(msg))
}

func slackDebug(_ msg: String) async {
  await Current.slackClient.send(.debug(msg))
}

func slackAudio(_ msg: String) async {
  await Current.slackClient.send(.audio(msg))
}

func slackDownload(_ msg: String) async {
  await Current.slackClient.send(.download(msg))
}

func slackInfo(_ msg: String) async {
  await Current.slackClient.send(.info(msg))
}

func slackOrder(_ msg: String) async {
  await Current.slackClient.send(.order(msg))
}

extension FlpSlack.Message.Channel: Equatable {}
