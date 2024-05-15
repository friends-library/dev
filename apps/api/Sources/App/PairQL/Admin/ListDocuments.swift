import PairQL

struct ListDocuments: Pair {
  static let auth: Scope = .queryEntities

  struct DocumentOutput: PairOutput {
    let id: Document.Id
    let title: String
    let friend: ListFriends.FriendOutput
  }

  typealias Output = [DocumentOutput]
}

// resolver

extension ListDocuments: NoInputResolver {
  static func resolve(in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    let documents = try await Document.Joined.all()
    return documents.map { document in
      .init(
        id: document.id,
        title: document.title,
        friend: .init(model: document.friend.model)
      )
    }
  }
}
