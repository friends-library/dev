import PairQL

struct EditorDocumentMap: Pair {
  static let auth: Scope = .queryEntities
  // [directoryPath: trimmedUtf8ShortTitle]
  typealias Output = [String: String]
}

extension EditorDocumentMap: NoInputResolver {
  static func resolve(in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    let documents = try await Document.query().all()
    return documents.reduce(into: [:]) { acc, document in
      // TODO: need a join or something...
      // acc[document.directoryPath] =
      //   Asciidoc.trimmedUtf8ShortDocumentTitle(document.title, lang: .en)
    }
  }
}
