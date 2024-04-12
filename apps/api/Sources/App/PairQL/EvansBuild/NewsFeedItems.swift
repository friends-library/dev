import DuetSQL
import Foundation
import PairQL

struct NewsFeedItems: Pair {
  static var auth: Scope = .queryEntities

  typealias Input = Lang

  struct NewsFeedItem: PairOutput {
    enum Kind: PairNestable {
      case book
      case audiobook
      case spanishTranslation(
        isCompilation: Bool,
        friendName: String,
        englishHtmlShortTitle: String
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
    try context.verify(Self.auth)
    fatalError("mega query")
    // var items: [NewsFeedItem] = []

    // let impressions = try await EditionImpression.query()
    //   .limit(24)
    //   .orderBy(.createdAt, .desc)
    //   .all()

    // for impression in impressions {
    //   let edition = impression.edition.require()
    //   let document = edition.document.require()
    //   let friend = document.friend.require()
    //   guard !edition.isDraft,
    //         !document.incomplete,
    //         edition.id == document.primaryEdition?.id,
    //         friend.lang == lang else {
    //     continue
    //   }
    //   items.append(.init(
    //     kind: .book,
    //     htmlShortTitle: document.htmlShortTitle,
    //     documentSlug: document.slug,
    //     friendSlug: friend.slug,
    //     createdAt: impression.createdAt
    //   ))
    // }

    // let audiobooks = try await Audio.query()
    //   .limit(24)
    //   .orderBy(.createdAt, .desc)
    //   .all()

    // for audiobook in audiobooks {
    //   let edition = audiobook.edition.require()
    //   let document = edition.document.require()
    //   let friend = document.friend.require()
    //   guard !edition.isDraft,
    //         !document.incomplete,
    //         edition.id == document.primaryEdition?.id,
    //         friend.lang == lang else {
    //     continue
    //   }
    //   items.append(.init(
    //     kind: .audiobook,
    //     htmlShortTitle: document.htmlShortTitle,
    //     documentSlug: document.slug,
    //     friendSlug: friend.slug,
    //     createdAt: audiobook.createdAt
    //   ))
    // }

    // if lang == .en {
    //   let documents = try await Document.query()
    //     .where(.not(.isNull(.altLanguageId)))
    //     .where(.incomplete == false)
    //     .orderBy(.createdAt, .desc)
    //     .all()
    //     .filter { $0.friend.require().lang == .es }
    //     .filter(\.hasNonDraftEdition)
    //     .prefix(24)

    //   for document in documents {
    //     let edition = try expect(document.primaryEdition)
    //     let impression = try expect(edition.impression.require())
    //     let document = edition.document.require()
    //     let altLangDoc = try expect(document.altLanguageDocument.require())
    //     guard !edition.isDraft, !document.incomplete else { continue }
    //     let friend = document.friend.require()
    //     items.append(.init(
    //       kind: .spanishTranslation(
    //         isCompilation: friend.isCompilations,
    //         friendName: friend.name,
    //         englishHtmlShortTitle: altLangDoc.htmlShortTitle
    //       ),
    //       htmlShortTitle: document.htmlShortTitle,
    //       documentSlug: document.slug,
    //       friendSlug: friend.slug,
    //       createdAt: impression.createdAt
    //     ))
    //   }
    // }

    // return Array(
    //   items
    //     .sorted(by: { $0.createdAt > $1.createdAt })
    //     .prefix(24)
    // )
  }
}
