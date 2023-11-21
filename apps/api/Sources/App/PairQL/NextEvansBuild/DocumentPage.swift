import DuetSQL
import Foundation
import NonEmpty
import PairQL
import Vapor

struct AudioQualities<T: PairNestable>: PairNestable {
  let lq: T
  let hq: T
}

struct DocumentPage: Pair {
  static var auth: Scope = .queryEntities

  struct Input: PairInput {
    let lang: Lang
    let friendSlug: String
    let documentSlug: String
  }

  struct DocumentOutput: PairNestable {
    let authorName: String
    let authorSlug: String
    let authorGender: Friend.Gender
    let title: String
    let originalTitle: String?
    let isComplete: Bool
    let priceInCents: Int
    let description: String
    let numDownloads: Int
    let isCompilation: Bool
    let editions: [EditionOutput]
    let alternateLanguageDoc: AlternateLanguageDoc?
    let primaryEdition: PrimaryEdition

    struct AlternateLanguageDoc: PairNestable {
      let authorSlug: String
      let slug: String
    }
  }

  struct PrimaryEdition: PairNestable {
    let editionType: EditionType
    let printSize: PrintSize
    let paperbackVolumes: NonEmpty<[Int]>
    let isbn: ISBN
    let numChapters: Int
    let audiobook: Audiobook?

    struct Audiobook: PairNestable {
      let isIncomplete: Bool
      let numAudioParts: Int
      let m4bFilesize: AudioQualities<Bytes>
      let mp3ZipFilesize: AudioQualities<Bytes>
      let m4bLoggedDownloadUrl: AudioQualities<String>
      let mp3ZipLoggedDownloadUrl: AudioQualities<String>
      let podcastLoggedDownloadUrl: AudioQualities<String>
      let embedId: AudioQualities<Int64>
    }
  }

  struct OtherBookByAuthor: PairNestable {
    let title: String
    let editionType: EditionType
    let description: String
    let paperbackVolumes: NonEmpty<[Int]>
    let isbn: ISBN
    let audioDuration: String?
    let htmlShortTitle: String
    let documentSlug: String
    let createdAt: Date
  }

  struct EditionOutput: PairNestable {
    let type: EditionType
    let loggedDownloadUrls: LoggedDownloadUrls

    struct LoggedDownloadUrls: PairNestable {
      let epub: String
      let mobi: String
      let pdf: String
      let speech: String
    }
  }

  struct Output: PairOutput {
    let document: DocumentOutput
    let otherBooksByAuthor: [OtherBookByAuthor]
    let numTotalBooks: Int
  }
}

extension DocumentPage: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    async let allDocuments = Document.query().all()
    async let matchingDocuments = Document.query()
      .where(.slug == input.documentSlug)
      .all()

    let numTotalBooks = try await allDocuments
      .filter(\.hasNonDraftEdition)
      .filter { $0.lang == input.lang }
      .count

    let document = try await matchingDocuments
      .first { $0.lang == input.lang && $0.friend.require().slug == input.friendSlug }

    guard let document else {
      throw Abort(.notFound)
    }

    let friend = document.friend.require()
    let editions = document.editions.require()
    let primaryEdition = try expect(document.primaryEdition)
    let primaryEditionImpression = try expect(primaryEdition.impression.require())
    let isbn = try expect(primaryEdition.isbn.require())

    var audiobook: PrimaryEdition.Audiobook?
    if let audio = primaryEdition.audio.require() {
      let audioParts = audio.parts.require()
      guard let firstAudioPart = audioParts.first else {
        throw context.error(id: "08cfb2ed", type: .serverError)
      }
      let embedId: AudioQualities<Int64>
      if audioParts.count == 1 {
        embedId = .init(
          lq: firstAudioPart.externalIdLq.rawValue,
          hq: firstAudioPart.externalIdHq.rawValue
        )
      } else if let playlistIdHq = audio.externalPlaylistIdHq,
                let playlistIdLq = audio.externalPlaylistIdLq {
        embedId = .init(
          lq: playlistIdLq.rawValue,
          hq: playlistIdHq.rawValue
        )
      } else {
        throw context.error(id: "0516b86f", type: .serverError)
      }
      audiobook = .init(
        isIncomplete: audio.isIncomplete,
        numAudioParts: audioParts.count,
        m4bFilesize: .init(lq: audio.m4bSizeLq, hq: audio.m4bSizeHq),
        mp3ZipFilesize: .init(lq: audio.mp3ZipSizeLq, hq: audio.mp3ZipSizeHq),
        m4bLoggedDownloadUrl: .init(
          lq: audio.files.m4b.lq.logUrl.absoluteString,
          hq: audio.files.m4b.hq.logUrl.absoluteString
        ),
        mp3ZipLoggedDownloadUrl: .init(
          lq: audio.files.mp3s.lq.logUrl.absoluteString,
          hq: audio.files.mp3s.hq.logUrl.absoluteString
        ),
        podcastLoggedDownloadUrl: .init(
          lq: audio.files.podcast.lq.logUrl.absoluteString,
          hq: audio.files.podcast.hq.logUrl.absoluteString
        ),
        embedId: embedId
      )
    }

    return .init(
      document: .init(
        authorName: friend.name,
        authorSlug: friend.slug,
        authorGender: friend.gender,
        title: document.title,
        originalTitle: document.originalTitle,
        isComplete: !document.incomplete,
        priceInCents: primaryEditionImpression.paperbackPrice.rawValue,
        description: document.description,
        numDownloads: try await document.numDownloads(),
        isCompilation: friend.isCompilations,
        editions: try editions.filter { !$0.isDraft }.map { edition in
          let impression = try expect(edition.impression.require())
          return .init(
            type: edition.type,
            loggedDownloadUrls: .init(
              epub: impression.files.ebook.epub.logUrl.absoluteString,
              mobi: impression.files.ebook.mobi.logUrl.absoluteString,
              pdf: impression.files.ebook.pdf.logUrl.absoluteString,
              speech: impression.files.ebook.speech.logUrl.absoluteString
            )
          )
        },
        alternateLanguageDoc: (try await document.altLanguageDocument()).map {
          .init(authorSlug: friend.slug, slug: $0.slug)
        },
        primaryEdition: .init(
          editionType: primaryEdition.type,
          printSize: primaryEditionImpression.paperbackSize,
          paperbackVolumes: primaryEditionImpression.paperbackVolumes,
          isbn: isbn.code,
          numChapters: primaryEdition.chapters.require().count,
          audiobook: audiobook
        )
      ),
      otherBooksByAuthor: try friend.documents.require().filter(\.hasNonDraftEdition)
        .filter { $0.slug != input.documentSlug }
        .map { otherDoc in
          let edition = try expect(otherDoc.primaryEdition)
          return .init(
            title: otherDoc.title,
            editionType: edition.type,
            description: otherDoc.description,
            paperbackVolumes: try expect(edition.impression.require()).paperbackVolumes,
            isbn: try expect(edition.isbn.require()).code,
            audioDuration: (edition.audio.require()).map(\.humanDurationClock),
            htmlShortTitle: otherDoc.htmlShortTitle,
            documentSlug: otherDoc.slug,
            createdAt: otherDoc.createdAt
          )
        },
      numTotalBooks: numTotalBooks
    )
  }
}

func expect<T>(_ value: T?, file: StaticString = #file, line: UInt = #line) throws -> T {
  guard let value else {
    throw PqlError(
      id: "87b64b2a",
      requestId: "(unknown)",
      type: .serverError,
      detail: "unexpected nil for \(T.self) from \(file):\(line)"
    )
  }
  return value
}