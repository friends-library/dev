import DuetSQL
import PairQL

struct SelectedDocuments: PairInput {
  let lang: Lang
  let slugs: [Slugs]

  struct Slugs: PairNestable {
    let friendSlug: String
    let documentSlug: String
  }
}

struct GettingStartedBooks: Pair {
  static var auth: Scope = .queryEntities

  typealias Input = SelectedDocuments

  struct DocumentOutput: PairOutput {
    let title: String
    let slug: String
    let editionType: EditionType
    let isbn: ISBN
    let customCss: String?
    let customHtml: String?
    let isCompilation: Bool
    let friendName: String
    let friendSlug: String
    let friendGender: Friend.Gender
    let htmlShortTitle: String
    let hasAudio: Bool
  }

  typealias Output = [DocumentOutput]
}

extension GettingStartedBooks: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)

    let documents = try await input.resolve()

    return try documents.map { document in
      let friend = try expect(document.friend.require())
      let edition = try expect(document.primaryEdition)
      return .init(
        title: document.title,
        slug: document.slug,
        editionType: edition.type,
        isbn: try expect(edition.isbn.require()).code,
        customCss: nil,
        customHtml: nil,
        isCompilation: friend.isCompilations,
        friendName: friend.name,
        friendSlug: friend.slug,
        friendGender: friend.gender,
        htmlShortTitle: document.htmlShortTitle,
        hasAudio: edition.audio.require() != nil
      )
    }
  }
}

extension SelectedDocuments {
  func resolve() async throws -> [Document] {
    let allDocuments = try await Document.query()
      .where(.slug |=| slugs.map { .string($0.documentSlug) })
      .all()

    var documents: [Document] = []
    for slug in slugs {
      let matchedDocument = allDocuments.filter { document in
        guard document.slug == slug.documentSlug else { return false }
        let friend = document.friend.require()
        return friend.slug == slug.friendSlug && friend.lang == lang
      }.first
      documents.append(try expect(matchedDocument))
    }
    return documents
  }
}
