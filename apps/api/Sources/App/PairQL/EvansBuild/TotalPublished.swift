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
    try context.verify(self.auth)
    let allDocuments = try await Document.Joined.all()
    let allAudios = try await Audio.Joined.all()

    return .init(
      books: .init(
        en: allDocuments
          .filter { $0.hasNonDraftEdition && !$0.friend.outOfBand }
          .count(where: { $0.friend.lang == .en }),

        es: allDocuments
          .filter { $0.hasNonDraftEdition && !$0.friend.outOfBand }
          .count(where: { $0.friend.lang == .es }),

      ),
      audiobooks: .init(
        en: allAudios
          .filter {
            $0.edition.document.friend.lang == .en && !$0.edition.document.friend.outOfBand
          }
          .count(where: { $0.edition.isDraft == false }),

        es: allAudios
          .filter {
            $0.edition.document.friend.lang == .es && !$0.edition.document.friend.outOfBand
          }
          .count(where: { $0.edition.isDraft == false }),

      ),
    )
  }
}
