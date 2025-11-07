import NonEmpty
import PairQL

struct DpcEditions: Pair {
  static let auth: Scope = .queryEntities

  struct EditionOutput: PairOutput {
    let id: Edition.Id
    let type: EditionType
    let editor: String?
    let directoryPath: String
    let paperbackSplits: [Int]?
    let isbn: ISBN?
    let document: DocumentOutput
    let friend: FriendOutput

    struct DocumentOutput: PairNestable {
      let title: String
      let originalTitle: String?
      let description: String
      let slug: String
      let published: Int?
    }

    struct FriendOutput: PairNestable {
      let isCompilations: Bool
      let name: String
      let alphabeticalName: String
      let slug: String
      let lang: Lang
    }
  }

  typealias Output = [EditionOutput]
}

extension DpcEditions: NoInputResolver {
  static func resolve(in context: AuthedContext) async throws -> Output {
    let editions = try await Edition.Joined.all()
    return editions.map { edition in
      let document = edition.document
      let friend = document.friend
      return .init(
        id: edition.id,
        type: edition.type,
        editor: edition.editor,
        directoryPath: edition.directoryPath,
        paperbackSplits: edition.paperbackSplits.map { Array($0) },
        isbn: edition.isbn?.code,
        document: .init(
          title: document.title,
          originalTitle: document.originalTitle,
          description: document.description,
          slug: document.slug,
          published: document.published,
        ),
        friend: .init(
          isCompilations: friend.isCompilations,
          name: friend.name,
          alphabeticalName: friend.alphabeticalName,
          slug: friend.slug,
          lang: friend.lang,
        ),
      )
    }
  }
}
