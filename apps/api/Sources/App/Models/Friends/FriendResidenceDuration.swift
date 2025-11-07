import Duet

struct FriendResidenceDuration: Codable, Sendable {
  var id: Id
  var friendResidenceId: FriendResidence.Id
  var start: Int
  var end: Int
  var createdAt = Current.date()

  init(
    id: Id = .init(),
    friendResidenceId: FriendResidence.Id,
    start: Int,
    end: Int,
  ) {
    self.id = id
    self.friendResidenceId = friendResidenceId
    self.start = start
    self.end = end
  }
}

// extensions

extension FriendResidenceDuration {
  func isValid() async -> Bool {
    self.start.isValidEarlyQuakerYear && self.end.isValidEarlyQuakerYear && self.start <= self.end
  }
}
