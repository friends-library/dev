import DuetSQL
import Foundation
import NonEmpty
import PairQL

struct FriendPage: Pair {
  static let auth: Scope = .queryEntities

  struct Input: PairInput {
    var slug: String
    var lang: Lang
  }

  struct Output: PairOutput {
    var born: Int?
    var died: Int?
    var name: String
    var slug: String
    var description: String
    var gender: Friend.Gender
    var isCompilations: Bool
    var documents: [Document]
    var residences: [Residence]
    var quotes: [Quote]
    var relatedDocuments: [RelatedDocument]

    struct Document: PairNestable {
      var id: App.Document.Id
      var title: String
      var htmlShortTitle: String
      var shortDescription: String
      var slug: String
      var numDownloads: Int
      var tags: [DocumentTag.TagType]
      var hasAudio: Bool
      var primaryEdition: PrimaryEdition
      var editionTypes: [EditionType]
      var customCss: String?
      var customHtml: String?

      struct PrimaryEdition: PairNestable {
        var isbn: ISBN
        var numPages: NonEmpty<[Int]>
        var size: PrintSize
        var type: EditionType
      }
    }

    struct Quote: PairNestable {
      var text: String
      var source: String
    }

    struct Residence: PairNestable {
      var city: String
      var region: String
      var durations: [Duration]

      struct Duration: PairNestable {
        var start: Int
        var end: Int
      }
    }

    struct RelatedDocument: PairNestable {
      var title: String
      var htmlShortTitle: String
      var slug: String
      var description: String
      var isCompilation: Bool
      var friendName: String
      var friendSlug: String
      var friendGender: Friend.Gender
      var editionType: EditionType
      var paperbackVolumes: NonEmpty<[Int]>
      var isbn: ISBN
      var customCss: String?
      var customHtml: String?
      var createdAt: Date
    }
  }
}

// resolver

extension FriendPage: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    fatalError("maybe.. mega query")
    // let friend = try await Friend.query()
    //   .where(.lang == input.lang)
    //   .where(.slug == input.slug)
    //   .first()

    // let downloads = try await Current.db.customQuery(
    //   AllDocumentDownloads.self,
    //   withBindings: [.enum(input.lang), .uuid(friend.id)]
    // ).urlPathDict

    // return try .init(friend, downloads: downloads, in: context)
  }
}

// extensions

extension FriendPage.Output {
  init(_ friend: Friend, downloads: [String: Int], in context: AuthedContext) throws {
    fatalError("mega query")
    // let documents = friend.documents.require().filter(\.hasNonDraftEdition)
    // guard !documents.isEmpty else {
    //   throw context.error(
    //     id: "0e8ded83",
    //     type: .badRequest,
    //     detail: "friend `\(friend.lang)/\(friend.slug)` has no published documents"
    //   )
    // }

    // let relatedDocs = documents
    //   .flatMap { $0.relatedDocuments.require() }
    //   .map { ($0, $0.document.require()) }
    //   .filter(\.1.hasNonDraftEdition)

    // let quotes = friend.quotes.require()
    // let residences = friend.residences.require()
    // guard friend.isCompilations || !residences.isEmpty else {
    //   throw context.error(
    //     id: "01c3e020",
    //     type: .serverError,
    //     detail: "non-compilations friend `\(friend.lang)/\(friend.slug)` has no residences"
    //   )
    // }

    // self = .init(
    //   born: friend.born,
    //   died: friend.died,
    //   name: friend.name,
    //   slug: friend.slug,
    //   description: friend.description,
    //   gender: friend.gender,
    //   isCompilations: friend.isCompilations,
    //   documents: try documents.map { document in
    //     let editions = document.editions.require()
    //     let primaryEdition = try expect(document.primaryEdition)
    //     let impression = try expect(primaryEdition.impression.require())
    //     let isbn = try expect(primaryEdition.isbn.require())
    //     return .init(
    //       id: document.id,
    //       title: document.title,
    //       htmlShortTitle: document.htmlShortTitle,
    //       shortDescription: document.partialDescription,
    //       slug: document.slug,
    //       numDownloads: downloads[document.urlPath] ?? 0,
    //       tags: document.tags.require().map(\.type),
    //       hasAudio: primaryEdition.audio.require() != nil,
    //       primaryEdition: .init(
    //         isbn: isbn.code,
    //         numPages: impression.paperbackVolumes,
    //         size: impression.paperbackSize,
    //         type: primaryEdition.type
    //       ),
    //       editionTypes: editions.map(\.type)
    //     )
    //   },
    //   residences: residences.map { residence in
    //     let durations = residence.durations.require()
    //     return .init(
    //       city: residence.city,
    //       region: residence.region,
    //       durations: durations.map { .init(start: $0.start, end: $0.end) }
    //     )
    //   },
    //   quotes: quotes.map { .init(text: $0.text, source: $0.source) },
    //   relatedDocuments: try relatedDocs.map { related, doc in
    //     let friend = doc.friend.require()
    //     let edition = try expect(doc.primaryEdition)
    //     return .init(
    //       title: doc.title,
    //       htmlShortTitle: doc.htmlShortTitle,
    //       slug: doc.slug,
    //       description: related.description,
    //       isCompilation: friend.isCompilations,
    //       friendName: friend.name,
    //       friendSlug: friend.slug,
    //       friendGender: friend.gender,
    //       editionType: edition.type,
    //       paperbackVolumes: try expect(edition.impression.require()).paperbackVolumes,
    //       isbn: try expect(edition.isbn.require()).code,
    //       createdAt: doc.createdAt
    //     )
    //   }
    // )
  }
}
