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

  var friend = Parent<Friend>.notLoaded

  var isValid: Bool {
    source.firstLetterIsUppercase && text.firstLetterIsUppercase && order > 0
  }

  init(
    id: Id = .init(),
    friendId: Friend.Id,
    source: String,
    text: String,
    order: Int,
    context: String? = nil
  ) {
    self.id = id
    self.friendId = friendId
    self.source = source
    self.text = text
    self.order = order
    self.context = context
  }
}
