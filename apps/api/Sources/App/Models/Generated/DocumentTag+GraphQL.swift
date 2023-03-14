// auto-generated, do not edit
import Graphiti
import Vapor

extension AppSchema {
  static var DocumentTagType: ModelType<DocumentTag> {
    Type(DocumentTag.self) {
      Field("id", at: \.id.rawValue.lowercased)
      Field("documentId", at: \.documentId.rawValue.lowercased)
      Field("type", at: \.type)
      Field("createdAt", at: \.createdAt)
      Field("isValid", at: \.isValid)
      Field("document", with: \.document)
    }
  }

  struct CreateDocumentTagInput: Codable {
    let id: UUID?
    let documentId: UUID
    let type: DocumentTag.TagType
  }

  struct UpdateDocumentTagInput: Codable {
    let id: UUID
    let documentId: UUID
    let type: DocumentTag.TagType
  }

  static var CreateDocumentTagInputType: AppInput<CreateDocumentTagInput> {
    Input(CreateDocumentTagInput.self) {
      InputField("id", at: \.id)
      InputField("documentId", at: \.documentId)
      InputField("type", at: \.type)
    }
  }

  static var UpdateDocumentTagInputType: AppInput<UpdateDocumentTagInput> {
    Input(UpdateDocumentTagInput.self) {
      InputField("id", at: \.id)
      InputField("documentId", at: \.documentId)
      InputField("type", at: \.type)
    }
  }

  static var getDocumentTag: AppField<DocumentTag, IdentifyEntityArgs> {
    Field("getDocumentTag", at: Resolver.getDocumentTag) {
      Argument("id", at: \.id)
    }
  }

  static var getDocumentTags: AppField<[DocumentTag], NoArgs> {
    Field("getDocumentTags", at: Resolver.getDocumentTags)
  }

  static var createDocumentTag: AppField<DocumentTag, InputArgs<CreateDocumentTagInput>> {
    Field("createDocumentTag", at: Resolver.createDocumentTag) {
      Argument("input", at: \.input)
    }
  }

  static var createDocumentTags: AppField<[DocumentTag], InputArgs<[CreateDocumentTagInput]>> {
    Field("createDocumentTags", at: Resolver.createDocumentTags) {
      Argument("input", at: \.input)
    }
  }

  static var updateDocumentTag: AppField<DocumentTag, InputArgs<UpdateDocumentTagInput>> {
    Field("updateDocumentTag", at: Resolver.updateDocumentTag) {
      Argument("input", at: \.input)
    }
  }

  static var updateDocumentTags: AppField<[DocumentTag], InputArgs<[UpdateDocumentTagInput]>> {
    Field("updateDocumentTags", at: Resolver.updateDocumentTags) {
      Argument("input", at: \.input)
    }
  }

  static var deleteDocumentTag: AppField<DocumentTag, IdentifyEntityArgs> {
    Field("deleteDocumentTag", at: Resolver.deleteDocumentTag) {
      Argument("id", at: \.id)
    }
  }
}

extension DocumentTag {
  convenience init(_ input: AppSchema.CreateDocumentTagInput) {
    self.init(documentId: .init(rawValue: input.documentId), type: input.type)
    if let id = input.id {
      self.id = .init(rawValue: id)
    }
  }

  convenience init(_ input: AppSchema.UpdateDocumentTagInput) {
    self.init(
      id: .init(rawValue: input.id),
      documentId: .init(rawValue: input.documentId),
      type: input.type
    )
  }

  func update(_ input: AppSchema.UpdateDocumentTagInput) {
    documentId = .init(rawValue: input.documentId)
    type = input.type
  }
}
