import Foundation

struct NPSubscriber: Codable, Sendable {
  var id: Id
  var email: String
  var lang: Lang
  var pendingConfirmationToken: UUID?
  var mixedQuotes: Bool
  var unsubscribedAt: Date? = nil
  var createdAt = Current.date()
  var updatedAt = Current.date()

  var confirmed: Bool {
    self.pendingConfirmationToken == nil
  }

  init(
    id: Id = .init(),
    token: UUID? = Current.uuid(),
    mixedQuotes: Bool = false,
    email: String,
    lang: Lang
  ) {
    self.id = id
    self.email = email
    self.lang = lang
    self.mixedQuotes = mixedQuotes
    self.pendingConfirmationToken = token
  }
}
