import Duet

final class RelatedDocument: Codable {
  var id: Id
  var description: String
  var documentId: Document.Id
  var parentDocumentId: Document.Id
  var createdAt = Current.date()
  var updatedAt = Current.date()

  var document = Parent<Document>.notLoaded
  var parentDocument = Parent<Document>.notLoaded

  var isValid: Bool {
    description.count >= 85
      && description.count <= 450
      && !description.containsUnpresentableSubstring
  }

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
