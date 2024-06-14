import XCTest
import XExpect

@testable import App

final class SendNarrowPathTests: AppTestCase {
  func testSendsFriendQuoteToBothGroupsIfNoNonFriends() {
    print("🧪 Running test 1")
    Current.randomNumberGenerator = {
      struct MockRandomNumberGenerator: RandomNumberGenerator {
        mutating func next() -> UInt64 {
          0
        }
      }
      return MockRandomNumberGenerator()
    }

    let allQuotes = [
      enFriend1,
      enFriend2,
      esFriend1,
    ]
    let action = SendNarrowPath().determineAction(sentQuotes: [], allQuotes: allQuotes)
    expect(action).toEqual(.send(
      enFriends: enFriend1.id,
      enAll: enFriend1.id,
      esFriends: esFriend1.id,
      esAll: esFriend1.id
    ))
  }

  func testSendsNonFriendQuotesToNonFriendOptins() {
    print("🧪 Running test 2")
    Current.randomNumberGenerator = {
      struct MockRandomNumberGenerator: RandomNumberGenerator {
        mutating func next() -> UInt64 {
          0
        }
      }
      return MockRandomNumberGenerator()
    }

    let allQuotes = [
      enOther1,
      enFriend1,
      enFriend2,
      esFriend1,
    ]
    let action = SendNarrowPath().determineAction(sentQuotes: [], allQuotes: allQuotes)
    expect(action).toEqual(.send(
      enFriends: enFriend1.id,
      enAll: enOther1.id,
      esFriends: esFriend1.id,
      esAll: esFriend1.id
    ))
  }
}

let enFriend1 = NPQuote(
  lang: .en,
  isFriend: true,
  quote: "Lorem",
  authorId: nil,
  authorName: "Jeff",
  documentId: nil
)
let enFriend2 = NPQuote(
  lang: .en,
  isFriend: true,
  quote: "Lorem",
  authorId: nil,
  authorName: "Bob",
  documentId: nil
)
let enOther1 = NPQuote(
  lang: .en,
  isFriend: false,
  quote: "Lorem",
  authorId: nil,
  authorName: "Lucy",
  documentId: nil
)
let esFriend1 = NPQuote(
  lang: .es,
  isFriend: true,
  quote: "Lorem",
  authorId: nil,
  authorName: "Pedro",
  documentId: nil
)
let esOther1 = NPQuote(
  lang: .es,
  isFriend: false,
  quote: "Lorem",
  authorId: nil,
  authorName: "Maria",
  documentId: nil
)
