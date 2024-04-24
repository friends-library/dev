import Foundation
import PairQL

struct AudiobooksPage: Pair {
  static let auth: Scope = .queryEntities

  typealias Input = Lang

  struct AudiobookOutput: PairOutput {
    var slug: String
    var title: String
    var htmlShortTitle: String
    var editionType: EditionType
    var isbn: ISBN
    var customCss: String?
    var customHtml: String?
    var isCompilation: Bool
    var friendName: String
    var friendSlug: String
    var friendGender: Friend.Gender
    var duration: String
    var shortDescription: String
    var createdAt: Date
  }

  typealias Output = [AudiobookOutput]
}

extension AudiobooksPage: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    let audiobooks = try await JoinedEntities.shared.audios()
    return try audiobooks.compactMap { audiobook in
      let edition = audiobook.edition
      let document = edition.document
      let friend = document.friend
      let parts = audiobook.parts
      guard friend.lang == input,
            !edition.isDraft,
            !parts.isEmpty,
            edition.impression != nil else {
        return nil
      }
      return .init(
        slug: document.slug,
        title: document.title,
        htmlShortTitle: document.htmlShortTitle,
        editionType: edition.type,
        isbn: try expect(edition.isbn).code,
        isCompilation: friend.isCompilations,
        friendName: friend.name,
        friendSlug: friend.slug,
        friendGender: friend.gender,
        duration: audiobook.humanDurationClock,
        shortDescription: document.partialDescription,
        createdAt: audiobook.createdAt
      )
    }
  }
}
