// auto-generated, do not edit
import Graphiti
import Vapor

extension AppSchema {
  static var DocumentType: ModelType<Document> {
    Type(Document.self) {
      Field("id", at: \.id.rawValue.lowercased)
      Field("friendId", at: \.friendId.rawValue.lowercased)
      Field("altLanguageId", at: \.altLanguageId?.rawValue.lowercased)
      Field("title", at: \.title)
      Field("slug", at: \.slug)
      Field("filename", at: \.filename)
      Field("published", at: \.published)
      Field("originalTitle", at: \.originalTitle)
      Field("incomplete", at: \.incomplete)
      Field("description", at: \.description)
      Field("partialDescription", at: \.partialDescription)
      Field("featuredDescription", at: \.featuredDescription)
      Field("createdAt", at: \.createdAt)
      Field("updatedAt", at: \.updatedAt)
      Field("lang", at: \.lang)
      Field("primaryEdition", at: \.primaryEdition)
      Field("hasNonDraftEdition", at: \.hasNonDraftEdition)
      Field("directoryPath", at: \.directoryPath)
      Field("htmlTitle", at: \.htmlTitle)
      Field("htmlShortTitle", at: \.htmlShortTitle)
      Field("utf8ShortTitle", at: \.utf8ShortTitle)
      Field("trimmedUtf8ShortTitle", at: \.trimmedUtf8ShortTitle)
      Field("isValid", at: \.isValid)
      Field("friend", with: \.friend)
      Field("editions", with: \.editions)
      Field("altLanguageDocument", with: \.altLanguageDocument)
      Field("relatedDocuments", with: \.relatedDocuments)
      Field("tags", with: \.tags)
    }
  }

  struct CreateDocumentInput: Codable {
    let id: UUID?
    let friendId: UUID
    let altLanguageId: UUID?
    let title: String
    let slug: String
    let filename: String
    let published: Int?
    let originalTitle: String?
    let incomplete: Bool
    let description: String
    let partialDescription: String
    let featuredDescription: String?
    let deletedAt: String?
  }

  struct UpdateDocumentInput: Codable {
    let id: UUID
    let friendId: UUID
    let altLanguageId: UUID?
    let title: String
    let slug: String
    let filename: String
    let published: Int?
    let originalTitle: String?
    let incomplete: Bool
    let description: String
    let partialDescription: String
    let featuredDescription: String?
    let deletedAt: String?
  }

  static var CreateDocumentInputType: AppInput<CreateDocumentInput> {
    Input(CreateDocumentInput.self) {
      InputField("id", at: \.id)
      InputField("friendId", at: \.friendId)
      InputField("altLanguageId", at: \.altLanguageId)
      InputField("title", at: \.title)
      InputField("slug", at: \.slug)
      InputField("filename", at: \.filename)
      InputField("published", at: \.published)
      InputField("originalTitle", at: \.originalTitle)
      InputField("incomplete", at: \.incomplete)
      InputField("description", at: \.description)
      InputField("partialDescription", at: \.partialDescription)
      InputField("featuredDescription", at: \.featuredDescription)
      InputField("deletedAt", at: \.deletedAt)
    }
  }

  static var UpdateDocumentInputType: AppInput<UpdateDocumentInput> {
    Input(UpdateDocumentInput.self) {
      InputField("id", at: \.id)
      InputField("friendId", at: \.friendId)
      InputField("altLanguageId", at: \.altLanguageId)
      InputField("title", at: \.title)
      InputField("slug", at: \.slug)
      InputField("filename", at: \.filename)
      InputField("published", at: \.published)
      InputField("originalTitle", at: \.originalTitle)
      InputField("incomplete", at: \.incomplete)
      InputField("description", at: \.description)
      InputField("partialDescription", at: \.partialDescription)
      InputField("featuredDescription", at: \.featuredDescription)
      InputField("deletedAt", at: \.deletedAt)
    }
  }

  static var getDocument: AppField<Document, IdentifyEntityArgs> {
    Field("getDocument", at: Resolver.getDocument) {
      Argument("id", at: \.id)
    }
  }

  static var getDocuments: AppField<[Document], NoArgs> {
    Field("getDocuments", at: Resolver.getDocuments)
  }

  static var createDocument: AppField<Document, InputArgs<CreateDocumentInput>> {
    Field("createDocument", at: Resolver.createDocument) {
      Argument("input", at: \.input)
    }
  }

  static var createDocuments: AppField<[Document], InputArgs<[CreateDocumentInput]>> {
    Field("createDocuments", at: Resolver.createDocuments) {
      Argument("input", at: \.input)
    }
  }

  static var updateDocument: AppField<Document, InputArgs<UpdateDocumentInput>> {
    Field("updateDocument", at: Resolver.updateDocument) {
      Argument("input", at: \.input)
    }
  }

  static var updateDocuments: AppField<[Document], InputArgs<[UpdateDocumentInput]>> {
    Field("updateDocuments", at: Resolver.updateDocuments) {
      Argument("input", at: \.input)
    }
  }

  static var deleteDocument: AppField<Document, IdentifyEntityArgs> {
    Field("deleteDocument", at: Resolver.deleteDocument) {
      Argument("id", at: \.id)
    }
  }
}

extension Document {
  convenience init(_ input: AppSchema.CreateDocumentInput) {
    self.init(
      friendId: .init(rawValue: input.friendId),
      altLanguageId: input.altLanguageId.map { .init(rawValue: $0) },
      title: input.title,
      slug: input.slug,
      filename: input.filename,
      published: input.published,
      originalTitle: input.originalTitle,
      incomplete: input.incomplete,
      description: input.description,
      partialDescription: input.partialDescription,
      featuredDescription: input.featuredDescription
    )
    if let id = input.id {
      self.id = .init(rawValue: id)
    }
  }

  convenience init(_ input: AppSchema.UpdateDocumentInput) {
    self.init(
      id: .init(rawValue: input.id),
      friendId: .init(rawValue: input.friendId),
      altLanguageId: input.altLanguageId.map { .init(rawValue: $0) },
      title: input.title,
      slug: input.slug,
      filename: input.filename,
      published: input.published,
      originalTitle: input.originalTitle,
      incomplete: input.incomplete,
      description: input.description,
      partialDescription: input.partialDescription,
      featuredDescription: input.featuredDescription
    )
  }

  func update(_ input: AppSchema.UpdateDocumentInput) throws {
    friendId = .init(rawValue: input.friendId)
    altLanguageId = input.altLanguageId.map { .init(rawValue: $0) }
    title = input.title
    slug = input.slug
    filename = input.filename
    published = input.published
    originalTitle = input.originalTitle
    incomplete = input.incomplete
    description = input.description
    partialDescription = input.partialDescription
    featuredDescription = input.featuredDescription
    deletedAt = try input.deletedAt.flatMap { try Date(fromIsoString: $0) }
    updatedAt = Current.date()
  }
}
