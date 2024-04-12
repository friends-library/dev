import DuetSQL
import NonEmpty

struct Edition: Codable, Sendable {
  var id: Id
  var documentId: Document.Id
  var type: EditionType
  var editor: String?
  var isDraft: Bool
  var paperbackSplits: NonEmpty<[Int]>?
  var paperbackOverrideSize: PrintSizeVariant?
  var createdAt = Current.date()
  var updatedAt = Current.date()
  var deletedAt: Date? = nil

  var document = Parent<Document>.notLoaded

  var lang: Lang {
    document.require().lang
  }

  var directoryPath: String {
    "\(document.require().directoryPath)/\(type)"
  }

  var filename: String {
    "\(document.require().filename)--\(type)"
  }

  init(
    id: Id = .init(),
    documentId: Document.Id,
    type: EditionType,
    editor: String?,
    isDraft: Bool = false,
    paperbackSplits: NonEmpty<[Int]>? = nil,
    paperbackOverrideSize: PrintSizeVariant? = nil
  ) {
    self.id = id
    self.documentId = documentId
    self.type = type
    self.editor = editor
    self.isDraft = isDraft
    self.paperbackSplits = paperbackSplits
    self.paperbackOverrideSize = paperbackOverrideSize
  }
}

extension Edition {
  struct DirectoryPathData {
    var document: Document.DirectoryPathData
    var type: EditionType
  }
}

extension Edition.DirectoryPathData: DirectoryPathable {
  var directoryPath: String {
    "\(document.directoryPath)/\(type)"
  }
}

// loaders

extension Edition {
  mutating func document() async throws -> Document {
    try await document.useLoaded(or: {
      try await Document.query()
        .where(.id == documentId)
        .first()
    })
  }

  func impression() async throws -> EditionImpression? {
    try await EditionImpression.query()
      .where(.editionId == id)
      .first()
  }

  func isbn() async throws -> Isbn? {
    try await Isbn.query()
      .where(.editionId == id)
      .first()
  }

  func audio() async throws -> Audio? {
    try await Audio.query()
      .where(.editionId == id)
      .first()
  }

  func chapters() async throws -> [EditionChapter] {
    try await EditionChapter.query()
      .where(.editionId == id)
      .all()
  }
}
