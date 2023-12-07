import NonEmpty
import PairQL

struct HomepageFeaturedBooks: Pair {
  static var auth: Scope = .queryEntities

  typealias Input = SelectedDocuments

  struct FeaturedBook: PairOutput {
    let isbn: ISBN
    let title: String
    let htmlShortTitle: String
    let paperbackVolumes: NonEmpty<[Int]>
    let customCss: String?
    let customHtml: String?
    let isCompilation: Bool
    let friendName: String
    let friendSlug: String
    let friendGender: Friend.Gender
    let documentSlug: String
    let featuredDescription: String
  }

  typealias Output = [FeaturedBook]
}

extension HomepageFeaturedBooks: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)

    let documents = try await input.resolve()

    return try documents.map { document in
      let friend = try expect(document.friend.require())
      let edition = try expect(document.primaryEdition)
      return .init(
        isbn: try expect(edition.isbn.require()).code,
        title: document.title,
        htmlShortTitle: document.htmlShortTitle,
        paperbackVolumes: try expect(edition.impression.require()).paperbackVolumes,
        customCss: nil,
        customHtml: nil,
        isCompilation: friend.isCompilations,
        friendName: friend.name,
        friendSlug: friend.slug,
        friendGender: friend.gender,
        documentSlug: document.slug,
        featuredDescription: try expect(document.featuredDescription)
      )
    }
  }
}
