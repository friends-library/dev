import PairQL

struct SelectableDocuments: Pair {
  static var auth: Scope = .queryEntities

  struct SelectableDocument: PairOutput {
    let id: Document.Id
    let title: String
    let lang: Lang
    let friendAlphabeticalName: String
  }

  typealias Output = [SelectableDocument]
}

// resolver

extension SelectableDocuments: NoInputResolver {
  static func resolve(in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    return try await .load()
  }
}

// extensions

extension Array where Element == SelectableDocuments.SelectableDocument {
  static func load() async throws -> Self {
    let documents = try await Document.query().all()
    return try await documents.concurrentMap { doc in
      var doc = doc
      let friend = try await doc.friend()
      return .init(
        id: doc.id,
        title: doc.title,
        lang: friend.lang,
        friendAlphabeticalName: friend.alphabeticalName
      )
    }
  }
}
