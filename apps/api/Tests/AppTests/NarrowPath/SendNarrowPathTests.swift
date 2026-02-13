import ConcurrencyExtras
import XCTest
import XExpect
import XPostmark

@testable import App

final class SendNarrowPathTests: AppTestCase, @unchecked Sendable {
  func testSendsFriendQuoteToBothGroupsIfNoNonFriends() {
    Current.randomNumberGenerator = { stableRng() }
    let action = SendNarrowPath().determineAction(
      sentQuotes: [],
      allQuotes: [self.enFriendId1, self.enFriendId2, self.esFriendId4],
      subscribers: self.allSubscribers,
    )

    switch action {
    case .send(let groups):
      expect(groups.map(\.testable)).toEqual([
        .init(to: ["en.friends"], quoteId: self.enFriendId1.id),
        .init(to: ["en.mixed"], quoteId: self.enFriendId1.id), // <-- same as friends
        .init(to: ["es.friends"], quoteId: self.esFriendId4.id),
        .init(to: ["es.mixed"], quoteId: self.esFriendId4.id), // <-- same as friends
      ])
    default:
      XCTFail("Expected .send, got \(action)")
    }
  }

  func testSendsNonFriendQuotesToNonFriendOptins() {
    Current.randomNumberGenerator = { stableRng(seed: .max) }
    let action = SendNarrowPath().determineAction(
      sentQuotes: [],
      allQuotes: [self.enFriendId2, self.enFriendId1, self.enOtherId3, self.esFriendId4],
      subscribers: self.allSubscribers,
    )

    switch action {
    case .send(let groups):
      expect(groups.map(\.testable)).toEqual([
        .init(to: ["en.friends"], quoteId: self.enFriendId1.id),
        .init(to: ["en.mixed"], quoteId: self.enOtherId3.id), // <- other
        .init(to: ["es.friends"], quoteId: self.esFriendId4.id),
        .init(to: ["es.mixed"], quoteId: self.esFriendId4.id),
      ])
    default:
      XCTFail("Expected .send, got \(action)")
    }
  }

  func testResetsEnglishIfNoQuotesUnsent() {
    let action = SendNarrowPath().determineAction(
      sentQuotes: [.init(quoteId: self.enFriendId1.id)],
      allQuotes: [self.enFriendId1, self.esFriendId4],
      subscribers: self.allSubscribers,
    )
    expect(action).toEqual(.reset(.en))
  }

  func testResetsSpanishIfNoQuotesUnsent() {
    let action = SendNarrowPath().determineAction(
      sentQuotes: [.init(quoteId: self.esFriendId4.id)],
      allQuotes: [self.enFriendId1, self.esFriendId4],
      subscribers: self.allSubscribers,
    )
    expect(action).toEqual(.reset(.es))
  }

  func testSendNarrowPathIntegration() async throws {
    // setup dependencies
    Current.randomNumberGenerator = { stableRng(seed: .max) }
    Current.date = { Date(timeIntervalSinceReferenceDate: 43000) }
    let sentEmails = ActorIsolated<[TemplateEmail]>([])
    Current.postmarkClient.sendTemplateEmailBatch = { emails in
      await sentEmails.setValue(emails)
      return .success([])
    }

    // setup database
    try await Current.db.delete(all: NPSentQuote.self)
    try await Current.db.delete(all: NPSubscriber.self)
    let quoteEn = try await Current.db.create(NPQuote(
      lang: .en,
      quote: "q1",
      isFriend: true,
      authorName: "George Fox",
      friendId: nil,
      documentId: nil,
    ))
    let quoteEs = try await Current.db.create(NPQuote(
      lang: .es,
      quote: "q2",
      isFriend: true,
      authorName: "Jorge Zorro",
      friendId: nil,
      documentId: nil,
    ))
    let quoteEs2 = try await Current.db.create(NPQuote(
      lang: .es,
      quote: "q3",
      isFriend: true,
      authorName: "Jorge Zorro",
      friendId: nil,
      documentId: nil,
    ))
    try await Current.db.create([self.enFriendsSub, self.esFriendsSub])

    // both spanish quotes have been sent, which exercizes the .reset path
    // these will be deleted, we should end up with one sent spanish quote
    try await Current.db.create([
      NPSentQuote(id: 7, quoteId: quoteEs.id),
      NPSentQuote(id: 8, quoteId: quoteEs2.id),
    ])

    // act
    try await SendNarrowPath().exec()

    // this proves the spanish sent quotes were reset
    await expect(try? Current.db.find(NPSentQuote.Id(7))).toBeNil()
    await expect(try? Current.db.find(NPSentQuote.Id(8))).toBeNil()

    // correct emails were sent
    await expect(sentEmails.value).toEqual([
      .init(
        to: "en.friends",
        from: "narrow-path@friendslibrary.com",
        templateAlias: "narrow-path",
        templateModel: [
          "lang": "en",
          "subject": "The Narrow Path",
          "html_quote": "<p>q1</p>",
          "text_quote": "q1",
          "html_cite": "&mdash;George Fox",
          "text_cite": "- George Fox",
          "date": "January 1",
          "website_name": "Friends Library",
          "html_footer_blurb": "Find free ebooks, audiobooks and more from early Quakers at <a href=\"https://www.friendslibrary.com\">www.friendslibrary.com</a>.",
          "text_footer_blurb": "Find free ebooks, audiobooks and more from early Quakers at https://friendslibrary.com",
          "unsubscribe_text": "Unsubscribe",
        ],
        messageStream: "narrow-path-en",
      ),
      .init(
        to: "es.friends",
        from: "camino-estrecho@bibliotecadelosamigos.org",
        templateAlias: "narrow-path",
        templateModel: [
          "lang": "es",
          "subject": "El Camino Estrecho",
          "html_quote": "<p>q3</p>",
          "text_quote": "q3",
          "html_cite": "&mdash;Jorge Zorro",
          "text_cite": "- Jorge Zorro",
          "date": "1 de enero",
          "website_name": "Biblioteca de los Amigos",
          "html_footer_blurb": "Puedes encontrar libros electrónicos y audiolibros gratuitos de los primeros Cuáqueros en <a href=\"https://www.bibliotecadelosamigos.org\">www.bibliotecadelosamigos.org</a>.",
          "text_footer_blurb": "Puedes encontrar libros electrónicos y audiolibros gratuitos de los primeros Cuáqueros en https://bibliotecadelosamigos.org",
          "unsubscribe_text": "Cancelar suscripción",
        ],
        messageStream: "narrow-path-es",
      ),
    ])

    // and we recorded the sent quotes
    let sentQuotes = try await NPSentQuote.query().all(in: Current.db)
    expect(Set(sentQuotes.map(\.quoteId))).toEqual(Set([quoteEn.id, quoteEs2.id]))
  }

  let enFriendId1 = NPQuote(
    id: 1,
    lang: .en,
    quote: "en-f-1",
    isFriend: true,
    friendId: .init(),
  )
  let enFriendId2 = NPQuote(
    id: 2,
    lang: .en,
    quote: "en-f-2",
    isFriend: true,
    friendId: .init(),
  )
  let enOtherId3 = NPQuote(
    id: 3,
    lang: .en,
    quote: "en-o-3",
    isFriend: false,
    friendId: nil,
  )
  let esFriendId4 = NPQuote(
    id: 4,
    lang: .es,
    quote: "es-f-4",
    isFriend: true,
    friendId: .init(),
  )
  let esOtherId5 = NPQuote(
    id: 5,
    lang: .es,
    quote: "es-o-5",
    isFriend: false,
    friendId: nil,
  )
  let enFriendsSub = NPSubscriber(token: nil, email: "en.friends", lang: .en)
  let enMixedSub = NPSubscriber(token: nil, mixedQuotes: true, email: "en.mixed", lang: .en)
  let esFriendsSub = NPSubscriber(token: nil, email: "es.friends", lang: .es)
  let esMixedSub = NPSubscriber(token: nil, mixedQuotes: true, email: "es.mixed", lang: .es)
  let unconfirmed = NPSubscriber(token: .init(), email: "unconfirmed", lang: .en)

  var allSubscribers: [NPSubscriber] {
    [self.enFriendsSub, self.enMixedSub, self.unconfirmed, self.esFriendsSub, self.esMixedSub]
  }
}

extension SendNarrowPath.Group {
  struct Testable: Equatable {
    var to: [String]
    var quoteId: NPQuote.Id
  }

  var testable: Testable {
    .init(to: recipients, quoteId: quote.id)
  }
}

func stableRng(seed: UInt64 = 0) -> any RandomNumberGenerator {
  struct MockRandomNumberGenerator: RandomNumberGenerator {
    let seed: UInt64
    mutating func next() -> UInt64 { seed }
  }
  return MockRandomNumberGenerator(seed: seed)
}
