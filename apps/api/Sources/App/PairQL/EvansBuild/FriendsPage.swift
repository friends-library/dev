import DuetSQL
import Foundation
import PairQL

struct FriendsPage: Pair {
  static var auth: Scope = .queryEntities

  typealias Input = Lang

  struct FriendOutput: PairOutput {
    let slug: String
    let gender: Friend.Gender
    let name: String
    let numBooks: Int
    let born: Int?
    let died: Int?
    let primaryResidence: PrimaryResidence
    let createdAt: Date

    struct PrimaryResidence: PairNestable {
      let city: String
      let region: String
    }
  }

  typealias Output = [FriendOutput]
}

extension FriendsPage: Resolver {
  static func resolve(with lang: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    let friends = try await Friend.query().where(.lang == lang).all()
    return try await friends.concurrentMap { friend -> FriendOutput? in
      guard !friend.isCompilations else { return nil }
      let documents = try await friend.documents()
      let numBooks = documents.filter(\.hasNonDraftEdition).count
      guard numBooks > 0 else { return nil }
      guard let residence = friend.primaryResidence else { return nil }
      return .init(
        slug: friend.slug,
        gender: friend.gender,
        name: friend.name,
        numBooks: numBooks,
        born: friend.born,
        died: friend.died,
        primaryResidence: .init(city: residence.city, region: residence.region),
        createdAt: friend.createdAt
      )
    }.compactMap { $0 }
  }
}

extension Lang: PairInput {}
