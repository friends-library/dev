import DuetSQL
import Foundation
import PairQL

struct PublishedFriendSlugs: Pair {
  static let auth: Scope = .queryEntities
  struct Input: PairInput {
    var lang: Lang
    var gender: Friend.Gender?
  }

  typealias Output = [String]
}

extension PublishedFriendSlugs: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    return try await Friend.Joined.all()
      .filter { friend in
        if let gender = input.gender, friend.gender != gender {
          return false
        }
        return friend.lang == input.lang && friend.hasNonDraftDocument
      }
      .map(\.slug)
  }
}
