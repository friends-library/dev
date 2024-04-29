import Fluent

extension RelatedDocument {
  enum M23 {
    static let tableName = "related_documents"
    static let parentDocumentId = FieldKey("parent_document_id")
    static let documentId = FieldKey("document_id")
    static let description = FieldKey("description")
  }
}
