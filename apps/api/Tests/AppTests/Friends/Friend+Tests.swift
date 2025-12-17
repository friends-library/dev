import Testing

@testable import App

@Suite struct FriendTests {
  @Test func `alphabetical name`() {
    var friend = Friend.empty
    friend.name = "Jared Henderson"
    #expect(friend.alphabeticalName == "Henderson, Jared")
  }

  @Test func `alphabetical maiden name`() {
    var friend = Friend.empty
    friend.name = "Catherine (Payton) Phillips"
    #expect(friend.alphabeticalName == "Phillips, Catherine (Payton)")
  }

  @Test func `alphabetical name with initials`() {
    var friend = Friend.empty
    friend.name = "Sarah R. Grubb"
    #expect(friend.alphabeticalName == "Grubb, Sarah R.")
  }
}
