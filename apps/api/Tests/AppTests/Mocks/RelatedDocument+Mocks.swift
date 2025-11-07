@testable import App

extension RelatedDocument {
  static var mock: RelatedDocument {
    RelatedDocument(
      description: "@mock description",
      documentId: .init(),
      parentDocumentId: .init(),
    )
  }

  static var empty: RelatedDocument {
    RelatedDocument(description: "", documentId: .init(), parentDocumentId: .init())
  }

  static var random: RelatedDocument {
    RelatedDocument(description: "@random".random, documentId: .init(), parentDocumentId: .init())
  }
}
