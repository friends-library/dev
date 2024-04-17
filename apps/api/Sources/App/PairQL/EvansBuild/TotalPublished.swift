import DuetSQL
import Foundation
import PairQL

struct TotalPublished: Pair {
  static var auth: Scope = .queryEntities

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
    fatalError("mega query")

//     let allDocuments = try await Document.query().all()
//     let allAudios = try await Audio.query().all()

//     return .init(
//       books: .init(
//         en: allDocuments
//           .filter(\.hasNonDraftEdition)
//           .filter { $0.friend.require().lang == .en }
//           .count,
//         es: allDocuments
//           .filter(\.hasNonDraftEdition)
//           .filter { $0.friend.require().lang == .es }
//           .count
//       ),
//       audiobooks: .init(
//         en: allAudios
//           .filter { $0.edition.require().document.require().friend.require().lang == .en }
//           .filter { $0.edition.require().isDraft == false }
//           .count,
//         es: allAudios
//           .filter { $0.edition.require().document.require().friend.require().lang == .es }
//           .filter { $0.edition.require().isDraft == false }
//           .count
//       )
//     )
  }
}
