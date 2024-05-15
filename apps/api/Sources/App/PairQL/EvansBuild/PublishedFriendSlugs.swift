import DuetSQL
import Foundation
import PairQL

struct PublishedFriendSlugs: Pair {
  static let auth: Scope = .queryEntities
  typealias Input = Lang
  typealias Output = [String]
}

extension PublishedFriendSlugs: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    return try await Friend.Joined.all()
      .filter { $0.lang == input && $0.hasNonDraftDocument }
      .map(\.slug)
  }
}
