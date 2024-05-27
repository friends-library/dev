import XSendGrid

extension SendGrid.EmailAddress {
  static let friendsLibrary: Self = .init(
    email: "notifications@api.friendslibrary.com",
    name: "Friends Library"
  )
}

extension SendGrid.Client {
  struct SlackErrorLogging: Sendable {
    var send: @Sendable (SendGrid.Email) async throws -> Void
  }
}

extension SendGrid.Client.SlackErrorLogging {
  static let live: Self = .init(send: { email in
    if let errorData = try await SendGrid.Client.live.send(email, Env.SENDGRID_API_KEY) {
      let msg = """
      **Failed to send SendGrid email**
      Response: `\(String(data: errorData, encoding: .utf8) ?? "<no data>")`
      To: \(email.firstRecipient.email)
      Subject: \(email.subject)
      Body: \(email.text)
      """
      await Current.slackClient.send(.error(msg))
    }
  })
  static let mock: Self = .init(send: { _ in })
}
