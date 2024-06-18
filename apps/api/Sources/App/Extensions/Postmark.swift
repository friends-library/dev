import XCore
import XPostmark

extension XPostmark.Client {
  struct SlackErrorLogging: Sendable {
    var send: @Sendable (XPostmark.Email) async -> Void
  }
}

extension XPostmark.Client.SlackErrorLogging {
  static let live: Self = .init(send: { email in
    let client: XPostmark.Client = .live(apiKey: Env.POSTMARK_API_KEY)
    switch await client.send(email) {
    case .failure(let error):
      let msg = """
      **Failed to send Postmark email**
      To: \(email.to)
      Subject: \(email.subject)
      Body: \(email.htmlBody ?? email.textBody ?? "(no body)")
      Error: `\(JSON.encode(error) ?? "\(String(describing: error))")`
      """
      await Current.slackClient.send(.error(msg))

    case .success where Env.POSTMARK_API_KEY == "POSTMARK_API_TEST":
      Current.logger.info("Test Postmark email accepted (not sent)")

    case .success:
      break
    }
  })
  static let mock: Self = .init(send: { _ in })
}
