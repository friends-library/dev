import DuetSQL

struct FriendResidence: Codable, Sendable {
  var id: Id
  var friendId: Friend.Id
  var city: String
  var region: String
  var createdAt = Current.date()
  var updatedAt = Current.date()

  var friend = Parent<Friend>.notLoaded
  var durations = Children<FriendResidenceDuration>.notLoaded

  var isValid: Bool {
    city.firstLetterIsUppercase && region.firstLetterIsUppercase
  }

  init(id: Id = .init(), friendId: Friend.Id, city: String, region: String) {
    self.id = id
    self.friendId = friendId
    self.city = city
    self.region = region
  }
}

// loaders

extension FriendResidence {
  mutating func durations() async throws -> [FriendResidenceDuration] {
    try await durations.useLoaded(or: {
      try await FriendResidenceDuration.query()
        .where(.friendResidenceId == id)
        .all()
    })
  }
}
