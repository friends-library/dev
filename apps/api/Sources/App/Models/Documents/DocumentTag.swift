import Duet

struct DocumentTag: Codable, Sendable {
  var id: Id
  var documentId: Document.Id
  var type: TagType
  var createdAt = Current.date()

  init(id: Id = .init(), documentId: Document.Id, type: TagType) {
    self.id = id
    self.documentId = documentId
    self.type = type
  }
}

// extensions

extension DocumentTag {
  enum TagType: String, Codable, CaseIterable, Sendable {
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
