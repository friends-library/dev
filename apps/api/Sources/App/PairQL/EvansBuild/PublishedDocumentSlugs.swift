import DuetSQL
import Foundation
import PairQL

struct PublishedDocumentSlugs: Pair {
  static let auth: Scope = .queryEntities
  typealias Input = Lang

  struct Slugs: PairOutput {
    let friendSlug: String
    let documentSlug: String
  }

  typealias Output = [Slugs]
}

extension PublishedDocumentSlugs: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)

    let allFriends = try await Friend.Joined.all()
      .filter { $0.lang == input }

    return allFriends.filter(\.hasNonDraftNonOobDocument).map { friend in
      friend.documents.filter(\.hasNonDraftEdition).map { document in
        Slugs(friendSlug: friend.slug, documentSlug: document.slug)
      }
    }.flatMap(\.self)
  }
}
