@testable import App

extension NPQuote {
  static var mock: NPQuote {
    NPQuote(lang: .en, quote: "mock quote", isFriend: true)
  }

  static var empty: NPQuote {
    NPQuote(lang: .en, quote: "", isFriend: false)
  }

  static var random: NPQuote {
    NPQuote(
      lang: Bool.random() ? .en : .es,
      quote: "mock quote".random,
      isFriend: Bool.random(),
      authorName: "mock author".random,
    )
  }
}
