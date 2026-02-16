import XCore
import XPostmark

extension XPostmark.Client {
  struct SlackErrorLogging: Sendable {
    var send: @Sendable (XPostmark.Email) async -> Void
    var sendTemplateEmail: @Sendable (XPostmark.TemplateEmail) async -> Void
    var sendTemplateEmailBatch: @Sendable ([XPostmark.TemplateEmail]) async
      -> Result<[MessageError], XPostmark.Client.Error>
    var deleteSuppression: @Sendable (String, Lang) async -> Result<Void, XPostmark.Client.Error>
  }

  struct MessageError: Swift.Error, Sendable {
    let errorCode: Int
    let message: String
    let address: String
  }
}

extension [XPostmark.Client.MessageError]: @retroactive Error {}

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
        await get(dependency: \.slackClient).send(.error(msg))

      case .success where Env.POSTMARK_API_KEY == "POSTMARK_API_TEST":
        get(dependency: \.logger).info("Test Postmark email accepted (not sent)")

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
        await get(dependency: \.slackClient).send(.error(msg))

      case .success where Env.POSTMARK_API_KEY == "POSTMARK_API_TEST":
        get(dependency: \.logger).info("Test Postmark email accepted (not sent)")

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
        await get(dependency: \.slackClient).send(.error(msg))
        return .failure(error)

      case .success(let results):
        return .success(
          results.enumerated()
            .compactMap { idx, result -> XPostmark.Client.MessageError? in
              guard case .failure(let error) = result else { return nil }
              return .init(
                errorCode: error.errorCode,
                message: error.message,
                address: emails[idx].to,
              )
            },
        )
      }
    },
    deleteSuppression: { email, lang in
      let client: XPostmark.Client = .live(apiKey: Env.POSTMARK_API_KEY)
      switch await client.deleteSuppression(email, "narrow-path-\(lang)") {
      case .failure(let error):
        let msg = """
        **Failed to delete Postmark suppression**
        Email: \(email)
        Stream: `narrow-path-\(lang)`
        Error: `\(JSON.encode(error) ?? "\(String(describing: error))")`
        """
        await get(dependency: \.slackClient).send(.error(msg))
        return .failure(error)
      case .success:
        return .success(())
      }
    },
  )
  static let mock = Self(
    send: { _ in },
    sendTemplateEmail: { _ in },
    sendTemplateEmailBatch: { _ in .success([]) },
    deleteSuppression: { _, _ in .success(()) },
  )
}
