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
    try context.verify(Self.auth)
    fatalError("probably not mega query")

    // let allFriends = try await Friend.query()
    //   .where(.lang == input)
    //   .all()

    // return allFriends.filter(\.hasNonDraftDocument).map { friend in
    //   let documents = friend.documents.require()
    //   return documents.filter(\.hasNonDraftEdition).map { document in
    //     Slugs(friendSlug: friend.slug, documentSlug: document.slug)
    //   }
    // }.flatMap { $0 }
  }
}
