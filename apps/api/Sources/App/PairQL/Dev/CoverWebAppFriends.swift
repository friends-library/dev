import NonEmpty
import PairQL

struct CoverWebAppFriends: Pair {
  static var auth: Scope = .queryEntities

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
    let friends = try await Friend.query().all()
    return try await friends.concurrentMap { friend in
      var friend = friend
      return .init(
        name: friend.name,
        alphabeticalName: friend.alphabeticalName,
        description: friend.description,
        documents: try await (try await friend.documents()).concurrentMap { doc in
          .init(
            lang: friend.lang,
            title: doc.title,
            isCompilation: friend.isCompilations,
            directoryPath: doc.directoryPath,
            description: doc.description,
            editions: try await (try await doc.editions()).concurrentMap { edition in
              let isbn = try await edition.isbn()
              let impression = try await edition.impression()
              var audioPartTitles: [String]?
              if var audio = try await edition.audio() {
                let parts = try await audio.parts()
                audioPartTitles = parts.map(\.title)
              }
              return .init(
                id: edition.id,
                path: edition.directoryPath,
                isDraft: edition.isDraft,
                type: edition.type,
                pages: impression.map(\.paperbackVolumes),
                size: impression?.paperbackSize,
                isbn: isbn?.code,
                audioPartTitles: audioPartTitles
              )
            }
          )
        }
      )
    }
  }
}
