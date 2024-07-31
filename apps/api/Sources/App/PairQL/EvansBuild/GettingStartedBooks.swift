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
  static let auth: Scope = .queryEntities

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

    return try await documents.concurrentMap { document in
      let friend = document.friend
      let edition = try expect(document.primaryEdition)
      let audio = edition.audio
      let isbn = try expect(edition.isbn)
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
  func resolve() async throws -> [Document.Joined] {
    let docSlugs = self.slugs.map(\.documentSlug)
    let allDocuments = try await Document.Joined.all()
      .filter { docSlugs.contains($0.slug) }

    var documents: [Document.Joined] = []
    for slug in self.slugs {
      let matchedDocument = allDocuments.filter { doc in
        guard doc.slug == slug.documentSlug else { return false }
        return doc.friend.slug == slug.friendSlug && doc.friend.lang == lang
      }.first
      documents.append(try expect(matchedDocument))
    }
    return documents
  }
}
