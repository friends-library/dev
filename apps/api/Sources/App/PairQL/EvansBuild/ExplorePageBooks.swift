import DuetSQL
import Foundation
import NonEmpty
import PairQL

struct ExplorePageBooks: Pair {
  static var auth: Scope = .queryEntities
  typealias Input = Lang

  struct Book: PairOutput {
    var slug: String
    var title: String
    var shortDescription: String
    var isCompilation: Bool
    var hasAudio: Bool
    var publishedYear: Int?
    var tags: [DocumentTag.TagType]
    var customCss: String?
    var customHtml: String?
    var htmlShortTitle: String
    var friendGender: Friend.Gender
    var friendName: String
    var friendSlug: String
    var friendBorn: Int?
    var friendDied: Int?
    var editions: [Edition]
    var primaryEdition: PrimaryEdition
    var friendPrimaryResidence: PrimaryResidence?
    var createdAt: Date

    struct PrimaryResidence: PairNestable {
      var region: String
      var durations: [Duration]

      struct Duration: PairNestable {
        var start: Int?
        var end: Int?
      }
    }

    struct Edition: PairNestable {
      var isbn: ISBN
      var type: EditionType
    }

    struct PrimaryEdition: PairNestable {
      var isbn: ISBN
      var type: EditionType
      var paperbackVolumes: NonEmpty<[Int]>
    }
  }

  typealias Output = [Book]
}

extension ExplorePageBooks: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    let langDocuments = try await Document.query().all()
      .filter(\.hasNonDraftEdition)
      .filter { $0.friend.require().lang == input }
      .sorted(by: {
        $0.primaryEdition?.impression.require()?.createdAt ?? .distantPast
          > $1.primaryEdition?.impression.require()?.createdAt ?? .distantPast
      })

    return try langDocuments.enumerated().map { i, document in
      let friend = document.friend.require()
      let primaryEdition = try expect(document.primaryEdition)
      let impression = try expect(primaryEdition.impression.require())
      let editions = document.editions.require()
      return .init(
        slug: document.slug,
        title: document.title,
        // we only need descriptions for 4 most recent books, this
        // reduces the size of the nextjs props significantly
        shortDescription: i < 4 ? document.partialDescription : "",
        isCompilation: friend.isCompilations,
        hasAudio: primaryEdition.audio.require() != nil,
        publishedYear: document.published,
        tags: document.tags.require().map(\.type),
        htmlShortTitle: document.htmlShortTitle,
        friendGender: friend.gender,
        friendName: friend.name,
        friendSlug: friend.slug,
        friendBorn: friend.born,
        friendDied: friend.died,
        editions: try editions.map { edition in
          .init(isbn: try expect(edition.isbn.require()).code, type: edition.type)
        },
        primaryEdition: .init(
          isbn: try expect(primaryEdition.isbn.require()).code,
          type: primaryEdition.type,
          paperbackVolumes: impression.paperbackVolumes
        ),
        friendPrimaryResidence: friend.primaryResidence.map { residence in
          .init(
            region: residence.region,
            durations: residence.durations.require().map {
              .init(start: $0.start, end: $0.end)
            }
          )
        },
        createdAt: impression.createdAt
      )
    }
  }
}
