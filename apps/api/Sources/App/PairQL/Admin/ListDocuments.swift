import PairQL

struct ListDocuments: Pair {
  static var auth: Scope = .queryEntities

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
    let documents = try await Document.query().all()
    return try await documents.concurrentMap { document in
      let friend = try await document.friend()
      return .init(
        id: document.id,
        title: document.title,
        friend: .init(model: friend)
      )
    }
  }
}
