import DuetSQL
import Foundation
import PairQL

struct NewsFeedItems: Pair {
  static let auth: Scope = .queryEntities

  typealias Input = Lang

  struct NewsFeedItem: PairOutput {
    enum Kind: PairNestable {
      case book
      case audiobook
      case spanishTranslation(
        isCompilation: Bool,
        friendName: String,
        englishHtmlShortTitle: String,
      )
    }

    let kind: Kind
    let htmlShortTitle: String
    let documentSlug: String
    let friendSlug: String
    let createdAt: Date
  }

  typealias Output = [NewsFeedItem]
}

extension NewsFeedItems: Resolver {
  static func resolve(with lang: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    var items: [NewsFeedItem] = []

    let impressions = try await EditionImpression.Joined.all()
      .sorted(by: { $0.createdAt > $1.createdAt })
      .prefix(24)

    for impression in impressions {
      let edition = impression.edition
      let document = edition.document
      let friend = document.friend
      guard !edition.isDraft,
            !document.incomplete,
            !friend.outOfBand,
            edition.id == document.primaryEdition?.id,
            friend.lang == lang else {
        continue
      }
      items.append(.init(
        kind: .book,
        htmlShortTitle: document.htmlShortTitle,
        documentSlug: document.slug,
        friendSlug: friend.slug,
        createdAt: impression.createdAt,
      ))
    }

    let audiobooks = try await Audio.Joined.all()
      .sorted(by: { $0.createdAt > $1.createdAt })
      .prefix(24)

    for audiobook in audiobooks {
      let edition = audiobook.edition
      let document = edition.document
      let friend = document.friend
      guard !edition.isDraft,
            !document.incomplete,
            !friend.outOfBand,
            edition.id == document.primaryEdition?.id,
            friend.lang == lang else {
        continue
      }
      items.append(.init(
        kind: .audiobook,
        htmlShortTitle: document.htmlShortTitle,
        documentSlug: document.slug,
        friendSlug: friend.slug,
        createdAt: audiobook.createdAt,
      ))
    }

    if lang == .en {
      let documents = try await Document.Joined.all()
        .filter { $0.altLanguageId != nil && !$0.incomplete }
        .filter { $0.friend.lang == .es && $0.hasNonDraftEdition && !$0.friend.outOfBand }
        .sorted(by: { $0.createdAt > $1.createdAt })
        .prefix(24)

      for document in documents {
        let edition = try expect(document.primaryEdition)
        let impression = try expect(edition.impression)
        let document = edition.document
        let altLangDoc = try expect(document.altLanguageDocument)
        guard !edition.isDraft, !document.incomplete else { continue }
        let friend = document.friend
        items.append(.init(
          kind: .spanishTranslation(
            isCompilation: friend.isCompilations,
            friendName: friend.name,
            englishHtmlShortTitle: altLangDoc.htmlShortTitle,
          ),
          htmlShortTitle: document.htmlShortTitle,
          documentSlug: document.slug,
          friendSlug: friend.slug,
          createdAt: impression.createdAt,
        ))
      }
    }

    return Array(
      items
        .sorted(by: { $0.createdAt > $1.createdAt })
        .prefix(24),
    )
  }
}
