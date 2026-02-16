import DuetSQL
import PairQL

struct AllFriendPages: Pair {
  static let auth: Scope = .queryEntities
  typealias Input = Lang
  typealias Output = [String: FriendPage.Output]
}

// resolver

extension AllFriendPages: Resolver {
  static func resolve(with lang: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)

    let friends = try await Friend.Joined.all()
      .filter { $0.lang == lang && $0.hasNonDraftNonOobDocument }

    let downloads = try await context.db.customQuery(
      AllDocumentDownloads.self,
      withBindings: [.enum(lang), .null],
    )

    return try friends.reduce(into: [:]) { result, friend in
      result[friend.slug] = try FriendPage.Output(
        friend,
        downloads: downloads.urlPathDict,
        in: context,
      )
    }
  }
}
