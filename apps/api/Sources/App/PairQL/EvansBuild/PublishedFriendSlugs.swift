import DuetSQL
import Foundation
import PairQL

struct PublishedFriendSlugs: Pair {
  static var auth: Scope = .queryEntities
  typealias Input = Lang
  typealias Output = [String]
}

extension PublishedFriendSlugs: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    fatalError("mega query")
    // let allFriends = try await Friend.query()
    //   .where(.lang == input)
    //   .all()
    // return allFriends.filter(\.hasNonDraftDocument).map(\.slug)
  }
}
