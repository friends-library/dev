import Foundation

struct NPQuote: Codable, Sendable {
  var id: Id
  var lang: Lang
  var quote: String
  var friendId: Friend.Id? = nil
  var documentId: Document.Id? = nil
  var createdAt = Current.date()
  var updatedAt = Current.date()

  var isFriend: Bool {
    friendId != nil
  }

  init(
    id: Id = .init(),
    lang: Lang,
    quote: String,
    friendId: Friend.Id? = nil,
    documentId: Document.Id? = nil
  ) {
    self.id = id
    self.lang = lang
    self.quote = quote
    self.friendId = friendId
    self.documentId = documentId
  }
}
