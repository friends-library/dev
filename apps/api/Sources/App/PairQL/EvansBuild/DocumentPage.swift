import DuetSQL
import Foundation
import NonEmpty
import PairQL
import TaggedTime
import Vapor

struct AudioQualities<T: PairNestable>: PairNestable {
  let lq: T
  let hq: T
}

struct DocumentPage: Pair {
  static let auth: Scope = .queryEntities

  struct Input: PairInput {
    var lang: Lang
    var friendSlug: String
    var documentSlug: String
  }

  struct DocumentOutput: PairNestable {
    var friendName: String
    var friendSlug: String
    var friendGender: Friend.Gender
    var title: String
    var htmlTitle: String
    var htmlShortTitle: String
    var originalTitle: String?
    var isComplete: Bool
    var priceInCents: Int
    var description: String
    var numDownloads: Int
    var isCompilation: Bool
    var ogImageUrl: String
    var editions: [EditionOutput]
    var alternateLanguageDoc: AlternateLanguageDoc?
    var primaryEdition: PrimaryEdition
    var customCss: String?
    var customCssUrl: String?

    struct AlternateLanguageDoc: PairNestable {
      var friendSlug: String
      var slug: String
    }
  }

  struct PrimaryEdition: PairNestable {
    var editionType: EditionType
    var printSize: PrintSize
    var paperbackVolumes: NonEmpty<[Int]>
    var isbn: ISBN
    var numChapters: Int
    var audiobook: Audiobook?

    struct Audiobook: PairNestable {
      var isIncomplete: Bool
      var reader: String
      var sourcePath: AudioQualities<String>
      var m4bFilesize: AudioQualities<Bytes>
      var mp3ZipFilesize: AudioQualities<Bytes>
      var m4bLoggedDownloadUrl: AudioQualities<String>
      var mp3ZipLoggedDownloadUrl: AudioQualities<String>
      var podcastLoggedDownloadUrl: AudioQualities<String>
      var podcastImageUrl: String
      var parts: [Part]

      struct Part: PairNestable {
        var title: String
        var playbackUrl: AudioQualities<String>
        var loggedDownloadUrl: AudioQualities<String>
        var sizeInBytes: AudioQualities<Bytes>
        var durationInSeconds: Seconds<Double>
        var createdAt: Date
      }
    }
  }

  struct OtherBookByFriend: PairNestable {
    var title: String
    var slug: String
    var editionType: EditionType
    var description: String
    var paperbackVolumes: NonEmpty<[Int]>
    var isbn: ISBN
    var audioDuration: String?
    var htmlShortTitle: String
    var documentSlug: String
    var customCss: String?
    var customHtml: String?
    var createdAt: Date
  }

  struct EditionOutput: PairNestable {
    var id: Edition.Id
    var type: EditionType
    var isbn: ISBN
    var printSize: PrintSize
    var numPages: NonEmpty<[Int]>
    var loggedDownloadUrls: LoggedDownloadUrls

    struct LoggedDownloadUrls: PairNestable {
      var epub: String
      var pdf: String
      var speech: String
    }
  }

  struct Output: PairOutput {
    var document: DocumentOutput
    var otherBooksByFriend: [OtherBookByFriend]
    var numTotalBooks: Int
  }
}

extension DocumentPage: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    let publishedDocs = try await Document.Joined.all()
      .filter(\.hasNonDraftEdition)
      .filter { $0.friend.lang == input.lang }

    let document = publishedDocs.first {
      $0.slug == input.documentSlug && $0.friend.slug == input.friendSlug
    }

    guard let document else {
      throw Abort(.notFound)
    }

    let rows = try await Current.db.customQuery(
      DocumentDownloads.self,
      withBindings: document.editions.map { .uuid($0.id) }
    )
    assert(rows.count == 1)
    let numDownloads = rows.first?.total ?? 0

    return try .init(
      document,
      downloads: [document.urlPath: numDownloads],
      numTotalBooks: publishedDocs.count,
      in: context
    )
  }
}

extension DocumentPage.Output {
  init(
    _ document: Document.Joined,
    downloads: [String: Int],
    numTotalBooks: Int,
    in context: AuthedContext
  ) throws {
    let friend = document.friend
    let editions = document.editions
    let primaryEdition = try expect(document.primaryEdition)
    let primaryEditionImpression = try expect(primaryEdition.impression)
    let isbn = try expect(primaryEdition.isbn)

    var audiobook: DocumentPage.PrimaryEdition.Audiobook?
    if let audio = primaryEdition.audio {
      audiobook = .init(
        isIncomplete: audio.isIncomplete,
        reader: audio.reader,
        sourcePath: .init(
          lq: audio.files.podcast.lq.sourcePath,
          hq: audio.files.podcast.hq.sourcePath
        ),
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
        podcastImageUrl: primaryEdition.images.square.w1400.url.absoluteString,
        parts: audio.parts
          .sorted(by: { $0.order < $1.order })
          .map { part in
            .init(
              title: part.title,
              playbackUrl: .init(
                lq: part.mp3File.lq.sourceUrl.absoluteString,
                hq: part.mp3File.hq.sourceUrl.absoluteString
              ),
              loggedDownloadUrl: .init(
                lq: part.mp3File.lq.logUrl.absoluteString,
                hq: part.mp3File.hq.logUrl.absoluteString
              ),
              sizeInBytes: .init(lq: part.mp3SizeLq, hq: part.mp3SizeHq),
              durationInSeconds: part.duration,
              createdAt: part.createdAt
            )
          }
      )
    }

    self = try .init(
      document: .init(
        friendName: friend.name,
        friendSlug: friend.slug,
        friendGender: friend.gender,
        title: document.title,
        htmlTitle: document.htmlTitle,
        htmlShortTitle: document.htmlShortTitle,
        originalTitle: document.originalTitle,
        isComplete: !document.incomplete,
        priceInCents: primaryEditionImpression.paperbackPrice.rawValue,
        description: document.description,
        numDownloads: downloads[document.urlPath] ?? 0,
        isCompilation: friend.isCompilations,
        ogImageUrl: primaryEdition.images.threeD.w700.url.absoluteString,
        editions: editions.filter { !$0.isDraft }.map { edition in
          let impression = try expect(edition.impression)
          return try .init(
            id: edition.id,
            type: edition.type,
            isbn: expect(edition.isbn).code,
            printSize: impression.paperbackSize,
            numPages: impression.paperbackVolumes,
            loggedDownloadUrls: .init(
              epub: impression.files.ebook.epub.logUrl.absoluteString,
              pdf: impression.files.ebook.pdf.logUrl.absoluteString,
              speech: impression.files.ebook.speech.logUrl.absoluteString
            )
          )
        },
        alternateLanguageDoc: document.altLanguageDocument.map {
          .init(friendSlug: friend.slug, slug: $0.slug)
        },
        primaryEdition: .init(
          editionType: primaryEdition.type,
          printSize: primaryEditionImpression.paperbackSize,
          paperbackVolumes: primaryEditionImpression.paperbackVolumes,
          isbn: isbn.code,
          numChapters: primaryEdition.chapters.count,
          audiobook: audiobook
        )
      ),
      otherBooksByFriend: friend.documents.filter(\.hasNonDraftEdition)
        .filter { $0.slug != document.slug }
        .map { otherDoc in
          let edition = try expect(otherDoc.primaryEdition)
          return try .init(
            title: otherDoc.title,
            slug: otherDoc.slug,
            editionType: edition.type,
            description: otherDoc.partialDescription,
            paperbackVolumes: expect(edition.impression).paperbackVolumes,
            isbn: expect(edition.isbn).code,
            audioDuration: edition.audio.map(\.humanDurationClock),
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

extension Document.Joined {
  var urlPath: String {
    "\(friend.slug)/\(model.slug)"
  }
}

private struct DocumentDownloads: CustomQueryable {
  static func query(numBindings: Int) -> String {
    let bindings = (1 ... numBindings).map { "$\($0)" }.joined(separator: ", ")
    return """
      SELECT SUM(document_downloads) AS total
      FROM (
        SELECT COUNT(*)::INTEGER AS document_downloads
        FROM \(Download.tableName)
        WHERE \(Download.columnName(.editionId)) IN (\(bindings))
      ) AS subquery;
    """
  }

  let total: Int
}
