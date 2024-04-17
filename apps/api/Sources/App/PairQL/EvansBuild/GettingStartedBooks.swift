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

    // TODO: probably mega query?
    return try await documents.concurrentMap { document in
      let friend = try expect(await document.friend())
      let edition = try expect(await document.primaryEdition())
      let audio = try await edition.audio()
      let isbn = try expect(await edition.isbn())
      return .init(
        title: document.title,
        slug: document.slug,
        editionType: edition.type,
        isbn: isbn.code,
        customCss: nil,
        customHtml: nil,
        isCompilation: friend.isCompilations,
        friendName: friend.name,
        friendSlug: friend.slug,
        friendGender: friend.gender,
        htmlShortTitle: document.htmlShortTitle,
        hasAudio: audio != nil
      )
    }
  }
}

extension SelectedDocuments {
  func resolve() async throws -> [Document] {
    let allDocuments = try await Document.query()
      .where(.slug |=| slugs.map { .string($0.documentSlug) })
      .all()
    return allDocuments

    // var documents: [Document] = []

    // for slug in slugs {
    //   let matchedDocument = allDocuments.filter { document in
    //     guard document.slug == slug.documentSlug else { return false }
    //     let friend = document.friend.require()
    //     return friend.slug == slug.friendSlug && friend.lang == lang
    //   }.first
    //   documents.append(try expect(matchedDocument))
    // }
    // return documents
  }
}
