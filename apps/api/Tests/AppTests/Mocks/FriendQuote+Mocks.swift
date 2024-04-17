@testable import App

extension FriendQuote {
  static var mock: FriendQuote {
    FriendQuote(friendId: .init(), source: "@mock source", text: "@mock text", order: 42)
  }

  static var empty: FriendQuote {
    FriendQuote(friendId: .init(), source: "", text: "", order: 0)
  }

  static var random: FriendQuote {
    FriendQuote(
      friendId: .init(),
      source: "@random".random,
      text: "@random".random,
      order: Int.random(in: 0 ... 1000)
    )
  }
}
