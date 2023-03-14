import Duet

final class DocumentTag: Codable {
  var id: Id
  var documentId: Document.Id
  var type: TagType
  var createdAt = Current.date()

  var document = Parent<Document>.notLoaded

  var isValid: Bool { true }

  init(id: Id = .init(), documentId: Document.Id, type: TagType) {
    self.id = id
    self.documentId = documentId
    self.type = type
  }
}

// extensions

extension DocumentTag {
  enum TagType: String, Codable, CaseIterable {
    case journal
    case letters
    case exhortation
    case doctrinal
    case treatise
    case history
    case allegory
    case spiritualLife
  }
}
