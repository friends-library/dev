import DuetSQL

struct FriendResidence: Codable, Sendable {
  var id: Id
  var friendId: Friend.Id
  var city: String
  var region: String
  var createdAt = Current.date()
  var updatedAt = Current.date()

  init(id: Id = .init(), friendId: Friend.Id, city: String, region: String) {
    self.id = id
    self.friendId = friendId
    self.city = city
    self.region = region
  }
}

// extensions

extension FriendResidence {
  func isValid() async -> Bool {
    self.city.firstLetterIsUppercase && self.region.firstLetterIsUppercase
  }
}
