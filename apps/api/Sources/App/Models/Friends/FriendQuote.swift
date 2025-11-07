import Duet

struct FriendQuote: Codable, Sendable {
  var id: Id
  var friendId: Friend.Id
  var source: String
  var text: String
  var order: Int
  var context: String?
  var createdAt = Current.date()
  var updatedAt = Current.date()

  init(
    id: Id = .init(),
    friendId: Friend.Id,
    source: String,
    text: String,
    order: Int,
    context: String? = nil,
  ) {
    self.id = id
    self.friendId = friendId
    self.source = source
    self.text = text
    self.order = order
    self.context = context
  }
}

// extensions

extension FriendQuote {
  func isValid() async -> Bool {
    self.source.firstLetterIsUppercase && self.text.firstLetterIsUppercase && self.order > 0
  }
}
