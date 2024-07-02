import Foundation

struct NPQuote: Codable, Sendable {
  var id: Id
  var lang: Lang
  var isFriend: Bool
  var authorName: String?
  var quote: String
  var friendId: Friend.Id? = nil
  var documentId: Document.Id? = nil
  var createdAt = Current.date()
  var updatedAt = Current.date()

  init(
    id: Id = .init(),
    lang: Lang,
    isFriend: Bool,
    authorName: String? = nil,
    quote: String,
    friendId: Friend.Id? = nil,
    documentId: Document.Id? = nil
  ) {
    self.id = id
    self.lang = lang
    self.isFriend = isFriend
    self.authorName = authorName
    self.quote = quote
    self.friendId = friendId
    self.documentId = documentId
  }
}

// extensions

extension NPQuote {
  var isValid: Bool {
    if friendId != nil, !isFriend {
      return false
    } else if !isFriend, authorName == nil {
      return false
    } else if quote.isEmpty {
      return false
    }
    return true
  }
}
