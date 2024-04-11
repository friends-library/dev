import PairQL
import TaggedTime

struct EditDocument: Pair {
  static var auth: Scope = .queryEntities

  typealias Input = Document.Id

  struct EditEdition: PairNestable {
    let id: Edition.Id
    let documentId: Document.Id
    let type: EditionType
    let paperbackSplits: [Int]?
    let paperbackOverrideSize: PrintSizeVariant?
    let editor: String?
    let isbn: String?
    let isDraft: Bool
    let audio: EditAudio?
  }

  struct EditAudio: PairNestable {
    let id: Audio.Id
    let editionId: Edition.Id
    let reader: String
    let isIncomplete: Bool
    let mp3ZipSizeHq: Bytes
    let mp3ZipSizeLq: Bytes
    let m4bSizeHq: Bytes
    let m4bSizeLq: Bytes
    let parts: [EditAudioPart]
  }

  struct EditAudioPart: PairNestable {
    let id: AudioPart.Id
    let audioId: Audio.Id
    let order: Int
    let title: String
    let duration: Seconds<Double>
    let chapters: [Int]
    let mp3SizeHq: Bytes
    let mp3SizeLq: Bytes
  }

  struct EditDocumentOutput: PairNestable {
    struct FriendOutput: PairNestable {
      let id: Friend.Id
      let name: String
      let lang: Lang
    }

    struct TagOutput: PairNestable {
      let id: DocumentTag.Id
      let documentId: Document.Id
      let type: DocumentTag.TagType
    }

    struct RelatedDocumentOutput: PairNestable {
      let id: RelatedDocument.Id
      let documentId: Document.Id
      let parentDocumentId: Document.Id
      let description: String
    }

    let id: Document.Id
    let friendId: Friend.Id
    let altLanguageId: Document.Id?
    let title: String
    let slug: String
    let filename: String
    let published: Int?
    let originalTitle: String?
    let incomplete: Bool
    let description: String
    let partialDescription: String
    let featuredDescription: String?
    let friend: FriendOutput
    let editions: [EditEdition]
    let tags: [TagOutput]
    let relatedDocuments: [RelatedDocumentOutput]
  }

  struct Output: PairOutput {
    let document: EditDocumentOutput
    let selectableDocuments: [SelectableDocuments.SelectableDocument]
  }
}

// resolver

extension EditDocument: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    let document = try await Document.find(input)
    return try await .init(
      document: .init(model: document),
      selectableDocuments: .load()
    )
  }
}

// extensions

extension EditDocument.EditDocumentOutput {
  init(model document: Document) async throws {
    var document = document
    let friend = try await document.friend()
    let editions = try await document.editions()
    let tags = try await document.tags()
    let relatedDocuments = try await document.relatedDocuments()

    id = document.id
    altLanguageId = document.altLanguageId
    title = document.title
    slug = document.slug
    filename = document.filename
    published = document.published
    originalTitle = document.originalTitle
    incomplete = document.incomplete
    description = document.description
    partialDescription = document.partialDescription
    featuredDescription = document.featuredDescription

    self.friend = .init(id: friend.id, name: friend.name, lang: friend.lang)

    self.editions = try await editions.concurrentMap { edition in
      var edition = edition
      let isbn = try await edition.isbn()
      let audio = try await edition.audio()
      var audioOutput: EditDocument.EditAudio?
      if var audio {
        let parts = try await audio.parts()
        audioOutput = .init(
          id: audio.id,
          editionId: audio.editionId,
          reader: audio.reader,
          isIncomplete: audio.isIncomplete,
          mp3ZipSizeHq: audio.mp3ZipSizeHq,
          mp3ZipSizeLq: audio.mp3ZipSizeLq,
          m4bSizeHq: audio.m4bSizeHq,
          m4bSizeLq: audio.m4bSizeLq,
          parts: parts.map { part in
            .init(
              id: part.id,
              audioId: part.audioId,
              order: part.order,
              title: part.title,
              duration: part.duration,
              chapters: Array(part.chapters),
              mp3SizeHq: part.mp3SizeHq,
              mp3SizeLq: part.mp3SizeLq
            )
          }
        )
      }
      return .init(
        id: edition.id,
        documentId: edition.documentId,
        type: edition.type,
        paperbackSplits: edition.paperbackSplits.map { Array($0) },
        paperbackOverrideSize: edition.paperbackOverrideSize,
        editor: edition.editor,
        isbn: isbn?.code.rawValue,
        isDraft: edition.isDraft,
        audio: audioOutput
      )
    }

    self.tags = tags.map { .init(id: $0.id, documentId: $0.documentId, type: $0.type) }
    self.relatedDocuments = relatedDocuments.map { relatedDoc in
      .init(
        id: relatedDoc.id,
        documentId: relatedDoc.documentId,
        parentDocumentId: relatedDoc.parentDocumentId,
        description: relatedDoc.description
      )
    }
    friendId = friend.id
  }
}
