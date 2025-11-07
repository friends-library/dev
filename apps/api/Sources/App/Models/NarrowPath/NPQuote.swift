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
    quote: String,
    isFriend: Bool = true,
    authorName: String? = nil,
    friendId: Friend.Id? = nil,
    documentId: Document.Id? = nil,
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
  func isValid() async -> Bool {
    if self.friendId != nil, !self.isFriend {
      false
    } else if !self.isFriend, self.authorName == nil {
      false
    } else if self.friendId != nil, self.authorName != nil {
      false
    } else if self.quote.isEmpty {
      false
    } else if self.quote.contains("\n\n") {
      false
    } else if self.quote.hasPrefix("\n") {
      false
    } else if self.quote.hasSuffix("\n") {
      false
    } else if self.quote.count(where: { $0 == "_" }) % 2 != 0 {
      // uneven number of underscores, invalid markdown -> html
      false
    } else if self.quote.contains("*") {
      // we are only supporting italics now
      false
    } else {
      true
    }
  }
}
