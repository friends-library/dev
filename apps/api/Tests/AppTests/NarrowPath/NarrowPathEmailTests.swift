import XCTest
import XExpect

@testable import App

final class NarrowPathEmailTests: AppTestCase, @unchecked Sendable {
  func testQuoteConversions() async throws {
    var markdown = "foo _bar_\nbaz"
    var quote = NPQuote(lang: .en, quote: markdown, authorName: "")
    var email = try await quote.email()
    expect(email.postmarkModel["text_quote"]).toEqual("foo bar\n\nbaz")
    expect(email.postmarkModel["html_quote"]).toEqual("<p>foo <em>bar</em></p><p>baz</p>")

    markdown = "foo bar baz"
    quote = NPQuote(lang: .en, quote: markdown, authorName: "")
    email = try await quote.email()
    expect(email.postmarkModel["text_quote"]).toEqual("foo bar baz")
    expect(email.postmarkModel["html_quote"]).toEqual("<p>foo bar baz</p>")
  }

  func testNonFriend() async throws {
    let quote = NPQuote(lang: .en, quote: "", authorName: "William Law")
    let email = try await quote.email()
    expect(email.postmarkModel["text_cite"]).toEqual("- William Law")
    expect(email.postmarkModel["html_cite"]).toEqual("&mdash;William Law")
  }

  func testFriendWithNoDoc() async throws {
    let friend = try await friend("Thomas Kite", "thomas-kite")
    let quote = NPQuote(lang: .en, quote: "", authorName: nil, friendId: friend.id)
    let email = try await quote.email()
    expect(email.postmarkModel["text_cite"]).toEqual("""
    - Thomas Kite

    https://friendslibrary.com/friend/thomas-kite
    """)
    expect(email.postmarkModel["html_cite"]).toEqual("""
    <a href="https://friendslibrary.com/friend/thomas-kite">&mdash;Thomas Kite</a>
    """)
  }

  func testJasonLinkedToHenderBlog() async throws {
    let quote = NPQuote(lang: .en, quote: "", authorName: "Jason Henderson", friendId: nil)
    let email = try await quote.email()
    expect(email.postmarkModel["text_cite"]).toEqual("""
    - Jason Henderson

    https://hender.blog
    """)
    expect(email.postmarkModel["html_cite"]).toEqual("""
    <a href="https://hender.blog">&mdash;Jason Henderson</a>
    """)
  }

  func testFriendWithDoc() async throws {
    let friend = try await friend("George Fox", "george-fox")
    let doc = try await document(
      "The Journal of George Fox -- Volume 1", // <-- asciidoc-ish title will be modifiedkj
      "journal",
      friend.id,
    )
    let quote = NPQuote(lang: .en, quote: "", friendId: friend.id, documentId: doc.id)
    let email = try await quote.email()
    expect(email.postmarkModel["text_cite"]).toEqual("""
    - George Fox, The Journal of George Fox – Vol. I

    https://friendslibrary.com/george-fox/journal
    """)
    expect(email.postmarkModel["html_cite"]).toEqual("""
    <a href="https://friendslibrary.com/friend/george-fox">&mdash;George Fox</a>
    <br />
    <a class="doc" href="https://friendslibrary.com/george-fox/journal">The Journal of George Fox &#8212; Vol.&#160;I</a>
    """)
  }

  func testFriendWithNoFriendIdButHasDoc() async throws {
    let friend = try await friend("Thomas Kendall", "thomas-kendall")
    let doc = try await document("Letters of Thomas Kendall", "letters", friend.id)
    let quote = NPQuote(
      lang: .en,
      quote: "",
      authorName: "Thomas Greer",
      friendId: nil, // <-- no friend id
      documentId: doc.id, // <-- but HAS doc id
    )
    let email = try await quote.email()
    expect(email.postmarkModel["text_cite"]).toEqual("""
    - Thomas Greer, Letters of Thomas Kendall

    https://friendslibrary.com/thomas-kendall/letters
    """)
    expect(email.postmarkModel["html_cite"]).toEqual("""
    &mdash;Thomas Greer
    <br />
    <a class="doc" href="https://friendslibrary.com/thomas-kendall/letters">Letters of Thomas Kendall</a>
    """)
  }

  func testEnglishCompilations() async throws {
    let friend = try await friend("Compilations", "compilations")
    let doc = try await document("Piety Promoted", "piety-promoted", friend.id)
    let quote = NPQuote(
      lang: .en,
      quote: "",
      authorName: "Liz Hooton",
      friendId: nil, // <-- no friend id
      documentId: doc.id, // <-- but HAS doc id, from compilation
    )
    let email = try await quote.email()
    expect(email.postmarkModel["text_cite"]).toEqual("""
    - Liz Hooton, Piety Promoted

    https://friendslibrary.com/compilations/piety-promoted
    """)
    expect(email.postmarkModel["html_cite"]).toEqual("""
    &mdash;Liz Hooton
    <br />
    <a class="doc" href="https://friendslibrary.com/compilations/piety-promoted">Piety Promoted</a>
    """)
  }

  func testSpanishFriendWithNoDoc() async throws {
    let friend = try await friend("Ann Branson", "ann-branson", lang: .es, gender: .female)
    let quote = NPQuote(lang: .es, quote: "", authorName: nil, friendId: friend.id)
    let email = try await quote.email()
    expect(email.postmarkModel["text_cite"]).toEqual("""
    - Ann Branson

    https://bibliotecadelosamigos.org/amiga/ann-branson
    """)
    expect(email.postmarkModel["html_cite"]).toEqual("""
    <a href="https://bibliotecadelosamigos.org/amiga/ann-branson">&mdash;Ann Branson</a>
    """)
  }

  func testSpanishFriendWithDoc() async throws {
    let friend = try await friend("Job Scott", "job-scott", lang: .es)
    let doc = try await document("Pearlos de Deepos", "pearlo", friend.id)
    let quote = NPQuote(lang: .en, quote: "", friendId: friend.id, documentId: doc.id)
    let email = try await quote.email()
    expect(email.postmarkModel["text_cite"]).toEqual("""
    - Job Scott, Pearlos de Deepos

    https://friendslibrary.com/job-scott/pearlo
    """)
    expect(email.postmarkModel["html_cite"]).toEqual("""
    <a href="https://friendslibrary.com/amigo/job-scott">&mdash;Job Scott</a>
    <br />
    <a class="doc" href="https://friendslibrary.com/job-scott/pearlo">Pearlos de Deepos</a>
    """)
  }

  func testSpanishFriendWithNoFriendIdButHasDoc() async throws {
    let friend = try await friend("John Banks", "john-banks", lang: .es)
    let doc = try await document("Memoirs of John Banks", "memoirs", friend.id)
    let quote = NPQuote(
      lang: .es,
      quote: "",
      authorName: "Mary Lamley",
      friendId: nil, // <-- no friend id
      documentId: doc.id, // <-- but HAS doc id
    )
    let email = try await quote.email()
    expect(email.postmarkModel["text_cite"]).toEqual("""
    - Mary Lamley, Memoirs of John Banks

    https://bibliotecadelosamigos.org/john-banks/memoirs
    """)
    expect(email.postmarkModel["html_cite"]).toEqual("""
    &mdash;Mary Lamley
    <br />
    <a class="doc" href="https://bibliotecadelosamigos.org/john-banks/memoirs">Memoirs of John Banks</a>
    """)
  }

  func testSpanishCompilations() async throws {
    let friend = try await friend("Compilaciones", "compilaciones", lang: .es, gender: .mixed)
    let doc = try await document("Piety Promotedo", "piety-promotedo", friend.id)
    let quote = NPQuote(
      lang: .es,
      quote: "",
      authorName: "Liz Rodriquez",
      friendId: nil, // <-- no friend id
      documentId: doc.id, // <-- but HAS doc id, from compilation
    )
    let email = try await quote.email()
    expect(email.postmarkModel["text_cite"]).toEqual("""
    - Liz Rodriquez, Piety Promotedo

    https://bibliotecadelosamigos.org/compilaciones/piety-promotedo
    """)
    expect(email.postmarkModel["html_cite"]).toEqual("""
    &mdash;Liz Rodriquez
    <br />
    <a class="doc" href="https://bibliotecadelosamigos.org/compilaciones/piety-promotedo">Piety Promotedo</a>
    """)
  }

  // helpers

  private func friend(
    _ name: String,
    _ slug: String,
    lang: Lang = .en,
    gender: Friend.Gender = .male,
  ) async throws -> Friend {
    try await self.db.create(Friend(
      lang: lang,
      name: name,
      slug: slug,
      gender: gender,
      description: "",
      born: nil,
      died: nil,
      published: nil,
    ))
  }

  private func document(
    _ title: String,
    _ slug: String,
    _ friendId: Friend.Id,
  ) async throws -> Document {
    try await self.db.create(Document(
      friendId: friendId,
      altLanguageId: nil,
      title: title,
      slug: slug,
      filename: "".random,
      published: nil,
      originalTitle: nil,
      incomplete: false,
      description: "",
      partialDescription: "",
      featuredDescription: nil,
    ))
  }
}
