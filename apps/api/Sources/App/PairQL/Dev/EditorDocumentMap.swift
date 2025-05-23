import PairQL

struct EditorDocumentMap: Pair {
  static let auth: Scope = .queryEntities
  // [directoryPath: trimmedUtf8ShortTitle]
  typealias Output = [String: String]
}

extension EditorDocumentMap: NoInputResolver {
  static func resolve(in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    let documents = try await Document.Joined.all()
    return documents.reduce(into: [:]) { acc, document in
      acc[document.directoryPath] = Asciidoc.trimmedUtf8ShortDocumentTitle(
        document.title,
        lang: document.friend.lang
      )
    }
  }
}
