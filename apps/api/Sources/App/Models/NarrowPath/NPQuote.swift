import Foundation

struct NPQuote: Codable, Sendable {
  var id: Id
  var lang: Lang
  var isFriend: Bool
  var quote: String
  var authorId: Friend.Id? = nil
  var authorName: String
  var documentId: Document.Id? = nil
  var createdAt = Current.date()
  var updatedAt = Current.date()

  init(
    id: Id = .init(),
    lang: Lang,
    isFriend: Bool,
    quote: String,
    authorId: Friend.Id?,
    authorName: String,
    documentId: Document.Id?
  ) {
    self.id = id
    self.lang = lang
    self.isFriend = isFriend
    self.quote = quote
    self.authorId = authorId
    self.authorName = authorName
    self.documentId = documentId
  }
}
