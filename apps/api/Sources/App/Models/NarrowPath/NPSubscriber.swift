import Foundation

final class NPSubscriber: Codable {
  var id: Id
  var email: String
  var lang: Lang
  var confirmationToken: UUID?
  var nonFriendQuotesOptIn: Bool
  var createdAt = Current.date()
  var updatedAt = Current.date()

  var isValid: Bool { true }

  init(
    id: Id = .init(),
    email: String,
    lang: Lang,
    nonFriendQuotesOptIn: Bool,
    confirmationToken: UUID = Current.uuid()
  ) {
    self.id = id
    self.email = email
    self.lang = lang
    self.nonFriendQuotesOptIn = nonFriendQuotesOptIn
    self.confirmationToken = confirmationToken
  }
}
