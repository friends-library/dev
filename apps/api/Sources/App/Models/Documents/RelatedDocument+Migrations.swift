import Fluent

extension RelatedDocument {
  enum M23 {
    static let tableName = "related_documents"
    nonisolated(unsafe) static let parentDocumentId = FieldKey("parent_document_id")
    nonisolated(unsafe) static let documentId = FieldKey("document_id")
    nonisolated(unsafe) static let description = FieldKey("description")
  }
}
