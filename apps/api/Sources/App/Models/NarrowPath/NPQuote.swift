import Foundation

final class NPQuote: Codable {
  var id: Id
  var lang: Lang
  var isFriend: Bool
  var createdAt = Current.date()
  var updatedAt = Current.date()
  var quote: String
  var authorId: UUID? = nil
  var authorName: String
  var documentId: UUID? = nil

  var isValid: Bool { true }

  init(
    id: Id = .init(),
    lang: Lang,
    isFriend: Bool,
    quote: String,
    authorId: UUID?,
    authorName: String,
    documentId: UUID?
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
