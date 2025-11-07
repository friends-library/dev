import NonEmpty
import PairQL

struct CoverWebAppFriends: Pair {
  static let auth: Scope = .queryEntities

  struct FriendOuput: PairOutput {
    let name: String
    let alphabeticalName: String
    let description: String
    let documents: [DocumentOutput]

    struct DocumentOutput: PairNestable {
      let lang: Lang
      let title: String
      let isCompilation: Bool
      let directoryPath: String
      let description: String
      let editions: [EditionOutput]

      struct EditionOutput: PairNestable {
        let id: Edition.Id
        let path: String
        let isDraft: Bool
        let type: EditionType
        let pages: NonEmpty<[Int]>?
        let size: PrintSize?
        let isbn: ISBN?
        let audioPartTitles: [String]?
      }
    }
  }

  typealias Output = [FriendOuput]
}

extension CoverWebAppFriends: NoInputResolver {
  static func resolve(in context: AuthedContext) async throws -> Output {
    let friends = try await Friend.Joined.all()
    return friends.map { friend in
      .init(
        name: friend.name,
        alphabeticalName: friend.alphabeticalName,
        description: friend.description,
        documents: friend.documents.map { document in
          .init(
            lang: document.friend.lang,
            title: document.title,
            isCompilation: document.friend.isCompilations,
            directoryPath: document.directoryPath,
            description: document.description,
            editions: document.editions.map { edition in
              .init(
                id: edition.id,
                path: edition.directoryPath,
                isDraft: edition.isDraft,
                type: edition.type,
                pages: edition.impression.map(\.paperbackVolumes),
                size: edition.impression?.paperbackSize,
                isbn: edition.isbn?.code,
                audioPartTitles: edition.audio.map { $0.parts.map(\.title) },
              )
            },
          )
        },
      )
    }
  }
}
