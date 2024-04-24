import DuetSQL
import Foundation
import PairQL

struct TotalPublished: Pair {
  static let auth: Scope = .queryEntities

  struct Counts: PairNestable {
    var en: Int
    var es: Int
  }

  struct Output: PairOutput {
    let books: Counts
    let audiobooks: Counts
  }
}

extension TotalPublished: NoInputResolver {
  static func resolve(in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    let allDocuments = try await JoinedEntities.shared.documents()
    let allAudios = try await JoinedEntities.shared.audios()

    return .init(
      books: .init(
        en: allDocuments
          .filter(\.hasNonDraftEdition)
          .filter { $0.friend.lang == .en }
          .count,
        es: allDocuments
          .filter(\.hasNonDraftEdition)
          .filter { $0.friend.lang == .es }
          .count
      ),
      audiobooks: .init(
        en: allAudios
          .filter { $0.edition.document.friend.lang == .en }
          .filter { $0.edition.isDraft == false }
          .count,
        es: allAudios
          .filter { $0.edition.document.friend.lang == .es }
          .filter { $0.edition.isDraft == false }
          .count
      )
    )
  }
}
