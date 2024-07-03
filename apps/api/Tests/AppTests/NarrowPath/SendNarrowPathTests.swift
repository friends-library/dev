import XCTest
import XExpect

@testable import App

final class SendNarrowPathTests: AppTestCase {
  func testSendsFriendQuoteToBothGroupsIfNoNonFriends() {
    Current.randomNumberGenerator = { stableRng() }
    let action = SendNarrowPath().determineAction(
      sentQuotes: [],
      allQuotes: [enFriendId1, enFriendId2, esFriendId4]
    )
    expect(action).toEqual(.send(
      enFriend: enFriendId1.id,
      enMixed: enFriendId1.id,
      esFriend: esFriendId4.id,
      esMixed: esFriendId4.id
    ))
  }

  func testSendsNonFriendQuotesToNonFriendOptins() {
    Current.randomNumberGenerator = { stableRng(seed: .max) }
    let action = SendNarrowPath().determineAction(
      sentQuotes: [],
      allQuotes: [enFriendId2, enFriendId1, enOtherId3, esFriendId4]
    )
    expect(action).toEqual(.send(
      enFriend: enFriendId1.id,
      enMixed: enOtherId3.id, // <- other
      esFriend: esFriendId4.id,
      esMixed: esFriendId4.id
    ))
  }

  func testResetsEnglishIfNoQuotesUnsent() {
    let action = SendNarrowPath().determineAction(
      sentQuotes: [.init(quoteId: enFriendId1.id)],
      allQuotes: [enFriendId1, esFriendId4]
    )
    expect(action).toEqual(.reset(.en))
  }

  func testResetsSpanishIfNoQuotesUnsent() {
    let action = SendNarrowPath().determineAction(
      sentQuotes: [.init(quoteId: esFriendId4.id)],
      allQuotes: [enFriendId1, esFriendId4]
    )
    expect(action).toEqual(.reset(.es))
  }

  let enFriendId1 = NPQuote(
    id: 1,
    lang: .en,
    quote: "en-f-1",
    isFriend: true,
    friendId: .init()
  )
  let enFriendId2 = NPQuote(
    id: 2,
    lang: .en,
    quote: "en-f-2",
    isFriend: true,
    friendId: .init()
  )
  let enOtherId3 = NPQuote(
    id: 3,
    lang: .en,
    quote: "en-o-3",
    isFriend: false,
    friendId: nil
  )
  let esFriendId4 = NPQuote(
    id: 4,
    lang: .es,
    quote: "es-f-4",
    isFriend: true,
    friendId: .init()
  )
  let esOtherId5 = NPQuote(
    id: 5,
    lang: .es,
    quote: "es-o-5",
    isFriend: false,
    friendId: nil
  )
}

func stableRng(seed: UInt64 = 0) -> any RandomNumberGenerator {
  struct MockRandomNumberGenerator: RandomNumberGenerator {
    let seed: UInt64
    mutating func next() -> UInt64 { seed }
  }
  return MockRandomNumberGenerator(seed: seed)
}
