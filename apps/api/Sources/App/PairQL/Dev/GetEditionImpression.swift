import PairQL

struct GetEditionImpression: Pair {
  static let auth: Scope = .queryEntities

  typealias Input = EditionImpression.Id

  struct Output: PairOutput {
    struct Files: PairNestable {
      var paperbackCover: [String]
      var paperbackInterior: [String]
      var epub: String
      var pdf: String
      var speech: String
      var app: String
    }

    let id: EditionImpression.Id
    let cloudFiles: Files
  }
}

extension GetEditionImpression: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    let impression = try await EditionImpression.Joined.find(input)
    return .init(id: impression.id, cloudFiles: .init(files: impression.files))
  }
}

extension GetEditionImpression.Output.Files {
  init(files: EditionImpressionFiles) {
    self = .init(
      paperbackCover: files.paperback.cover.map(\.sourcePath),
      paperbackInterior: files.paperback.interior.map(\.sourcePath),
      epub: files.ebook.epub.sourcePath,
      pdf: files.ebook.pdf.sourcePath,
      speech: files.ebook.speech.sourcePath,
      app: files.ebook.app.sourcePath
    )
  }
}
