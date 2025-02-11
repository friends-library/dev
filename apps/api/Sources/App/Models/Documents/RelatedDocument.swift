import Duet

struct RelatedDocument: Codable, Sendable {
  var id: Id
  var description: String
  var documentId: Document.Id
  var parentDocumentId: Document.Id
  var createdAt = Current.date()
  var updatedAt = Current.date()

  init(
    id: Id = .init(),
    description: String,
    documentId: Document.Id,
    parentDocumentId: Document.Id
  ) {
    self.id = id
    self.description = description
    self.documentId = documentId
    self.parentDocumentId = parentDocumentId
  }
}

// extensions

extension RelatedDocument {
  func isValid() async -> Bool {
    self.description.count >= 85
      && self.description.count <= 450
      && !self.description.containsUnpresentableSubstring
  }
}
