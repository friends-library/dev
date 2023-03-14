import Duet

final class FriendResidenceDuration: Codable {
  var id: Id
  var friendResidenceId: FriendResidence.Id
  var start: Int
  var end: Int
  var createdAt = Current.date()

  var residence = Parent<FriendResidence>.notLoaded

  var isValid: Bool {
    start.isValidEarlyQuakerYear && end.isValidEarlyQuakerYear && start <= end
  }

  init(
    id: Id = .init(),
    friendResidenceId: FriendResidence.Id,
    start: Int,
    end: Int
  ) {
    self.id = id
    self.friendResidenceId = friendResidenceId
    self.start = start
    self.end = end
  }
}
