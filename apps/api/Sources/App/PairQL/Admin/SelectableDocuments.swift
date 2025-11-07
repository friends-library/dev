import PairQL

struct SelectableDocuments: Pair {
  static let auth: Scope = .queryEntities

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
    try context.verify(self.auth)
    return try await .load()
  }
}

// extensions

extension [SelectableDocuments.SelectableDocument] {
  static func load() async throws -> Self {
    let documents = try await Document.Joined.all()
    return documents.map { document in
      .init(
        id: document.id,
        title: document.title,
        lang: document.friend.lang,
        friendAlphabeticalName: document.friend.alphabeticalName,
      )
    }
  }
}
