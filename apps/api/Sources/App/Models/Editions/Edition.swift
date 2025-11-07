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

  init(
    id: Id = .init(),
    documentId: Document.Id,
    type: EditionType,
    editor: String?,
    isDraft: Bool = false,
    paperbackSplits: NonEmpty<[Int]>? = nil,
    paperbackOverrideSize: PrintSizeVariant? = nil,
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

// extensions

extension Edition {
  struct DirectoryPathData: DirectoryPathable {
    var document: Document.DirectoryPathData
    var type: EditionType

    var directoryPath: String {
      "\(self.document.directoryPath)/\(self.type)"
    }
  }
}

extension Edition.Joined {
  var directoryPathData: Edition.DirectoryPathData {
    .init(document: document.directoryPathData, type: model.type)
  }

  var directoryPath: String {
    self.directoryPathData.directoryPath
  }
}
