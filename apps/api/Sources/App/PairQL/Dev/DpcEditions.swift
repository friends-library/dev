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
    fatalError("maybe mega query")
    // let editions = try await Edition.query().all()
    // return try await editions.concurrentMap { edition in
    //   var edition = edition
    //   let isbn = try await edition.isbn()
    //   var document = try await edition.document()
    //   let friend = try await document.friend()
    //   return .init(
    //     id: edition.id,
    //     type: edition.type,
    //     editor: edition.editor,
    //     directoryPath: edition.directoryPath,
    //     paperbackSplits: edition.paperbackSplits.map { Array($0) },
    //     isbn: isbn?.code,
    //     document: .init(
    //       title: document.title,
    //       originalTitle: document.originalTitle,
    //       description: document.description,
    //       slug: document.slug,
    //       published: document.published
    //     ),
    //     friend: .init(
    //       isCompilations: friend.isCompilations,
    //       name: friend.name,
    //       alphabeticalName: friend.alphabeticalName,
    //       slug: friend.slug,
    //       lang: friend.lang
    //     )
    //   )
    // }
  }
}
