import XCore
import XPostmark

extension XPostmark.Client {
  struct SlackErrorLogging: Sendable {
    var send: @Sendable (XPostmark.Email) async -> Void
    var sendTemplateEmail: @Sendable (XPostmark.TemplateEmail) async -> Void
    var sendTemplateEmailBatch: @Sendable ([XPostmark.TemplateEmail]) async
      -> Result<[MessageError], XPostmark.Client.Error>
  }

  struct MessageError: Swift.Error, Sendable {
    public let errorCode: Int
    public let message: String
    public let address: String
  }
}

extension Array: @retroactive Error where Element == XPostmark.Client.MessageError {}

extension XPostmark.Client.SlackErrorLogging {
  static let live: Self = .init(
    send: { email in
      let client: XPostmark.Client = .live(apiKey: Env.POSTMARK_API_KEY)
      switch await client.sendEmail(email) {
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
    },
    sendTemplateEmail: { email in
      let client: XPostmark.Client = .live(apiKey: Env.POSTMARK_API_KEY)
      switch await client.sendTemplateEmail(email) {
      case .failure(let error):
        let msg = """
        **Failed to send Postmark template email**
        To: \(email.to)
        TemplateAlias: \(email.templateAlias)
        TemplateModel: \(String(describing: email.templateModel))
        Error: `\(JSON.encode(error) ?? "\(String(describing: error))")`
        """
        await Current.slackClient.send(.error(msg))

      case .success where Env.POSTMARK_API_KEY == "POSTMARK_API_TEST":
        Current.logger.info("Test Postmark email accepted (not sent)")

      case .success:
        break
      }
    },
    sendTemplateEmailBatch: { emails in
      let client: XPostmark.Client = .live(apiKey: Env.POSTMARK_API_KEY)
      switch await client.sendTemplateEmailBatch(emails) {
      case .failure(let error):
        let msg = """
        **Failed to send Postmark template email batch**
        Size: \(emails.count)
        Stream \(emails.first?.messageStream ?? "unknown")
        Error: `\(JSON.encode(error) ?? "\(String(describing: error))")`
        """
        await Current.slackClient.send(.error(msg))
        return .failure(error)

      case .success(let results):
        return .success(
          results.enumerated()
            .compactMap { idx, result -> XPostmark.Client.MessageError? in
              guard case .failure(let error) = result else { return nil }
              return .init(
                errorCode: error.errorCode,
                message: error.message,
                address: emails[idx].to
              )
            }
        )
      }
    }
  )
  static let mock = Self(
    send: { _ in },
    sendTemplateEmail: { _ in },
    sendTemplateEmailBatch: { _ in .success([]) }
  )
}
