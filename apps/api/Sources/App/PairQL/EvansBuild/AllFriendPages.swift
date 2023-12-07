import DuetSQL
import PairQL

struct AllFriendPages: Pair {
  static var auth: Scope = .queryEntities
  typealias Input = Lang
  typealias Output = [String: FriendPage.Output]
}

// resolver

extension AllFriendPages: Resolver {
  static func resolve(with lang: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)

    let langFriends = try await Friend.query()
      .where(.lang == lang)
      .all()
      .filter(\.hasNonDraftDocument)

    let downloads = try await Current.db.customQuery(
      AllDocumentDownloads.self,
      withBindings: [.enum(lang), .null]
    )

    return try langFriends.reduce(into: [:]) { result, friend in
      result[friend.slug] = try FriendPage.Output(
        friend,
        downloads: downloads.urlPathDict,
        in: context
      )
    }
  }
}
