import Foundation

struct NPSubscriber: Codable, Sendable, Equatable {
  var id: Id
  var email: String
  var lang: Lang
  var pendingConfirmationToken: UUID?
  var mixedQuotes: Bool
  var unsubscribedAt: Date? = nil
  var createdAt = Date()
  var updatedAt = Date()

  var confirmed: Bool {
    self.pendingConfirmationToken == nil
  }

  init(
    id: Id = .init(),
    token: UUID?,
    mixedQuotes: Bool = false,
    email: String,
    lang: Lang,
  ) {
    self.id = id
    self.email = email
    self.lang = lang
    self.mixedQuotes = mixedQuotes
    self.pendingConfirmationToken = token
  }
}
