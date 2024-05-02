import Foundation
import PairQL
import TaggedTime

struct CreateEntity: Pair {
  static let auth: Scope = .queryTokens
  typealias Input = AdminRoute.Upsert
}

// resolver

extension CreateEntity: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    let model: any ApiModel

    switch input {
    case .audio(let input):
      model = Audio(
        id: input.id,
        editionId: input.editionId,
        reader: input.reader,
        mp3ZipSizeHq: input.mp3ZipSizeHq,
        mp3ZipSizeLq: input.mp3ZipSizeLq,
        m4bSizeHq: input.m4bSizeHq,
        m4bSizeLq: input.m4bSizeLq,
        isIncomplete: input.isIncomplete
      )

    case .audioPart(let input):
      model = AudioPart(
        id: input.id,
        audioId: input.audioId,
        title: input.title,
        duration: input.duration,
        chapters: try .fromArray(input.chapters),
        order: input.order,
        mp3SizeHq: input.mp3SizeHq,
        mp3SizeLq: input.mp3SizeLq
      )

    case .document(let input):
      model = Document(
        id: input.id,
        friendId: input.friendId,
        altLanguageId: input.altLanguageId,
        title: input.title,
        slug: input.slug,
        filename: input.filename,
        published: input.published,
        originalTitle: nilIfEmpty(input.originalTitle),
        incomplete: input.incomplete,
        description: input.description,
        partialDescription: input.partialDescription,
        featuredDescription: nilIfEmpty(input.featuredDescription)
      )

    case .documentTag(let input):
      model = DocumentTag(
        id: input.id,
        documentId: input.documentId,
        type: input.type
      )

    case .edition(let input):
      var isbn: Isbn
      do {
        isbn = try await Isbn.query().where(.isNull(.editionId)).first()
      } catch {
        await slackError("Failed to query ISBN to assign to new edition: \(error)")
        throw error
      }
      let edition = Edition(
        id: input.id,
        documentId: input.documentId,
        type: input.type,
        editor: nilIfEmpty(input.editor),
        isDraft: input.isDraft,
        paperbackSplits: try input.paperbackSplits.map { try .fromArray($0) },
        paperbackOverrideSize: input.paperbackOverrideSize
      )
      isbn.editionId = edition.id
      guard edition.isValid else { throw ModelError.invalidEntity }
      try await edition.create()
      try await isbn.save()
      return .success

    case .friend(let input):
      model = Friend(
        id: input.id,
        lang: input.lang,
        name: input.name,
        slug: input.slug,
        gender: input.gender,
        description: input.description,
        born: input.born,
        died: input.died,
        published: input.published
      )

    case .friendQuote(let input):
      model = FriendQuote(
        id: input.id,
        friendId: input.friendId,
        source: input.source,
        text: input.text,
        order: input.order,
        context: nilIfEmpty(input.context)
      )

    case .friendResidence(let input):
      model = FriendResidence(
        id: input.id,
        friendId: input.friendId,
        city: input.city,
        region: input.region
      )

    case .friendResidenceDuration(let input):
      model = FriendResidenceDuration(
        id: input.id,
        friendResidenceId: input.friendResidenceId,
        start: input.start,
        end: input.end
      )

    case .relatedDocument(let input):
      model = RelatedDocument(
        id: input.id,
        description: input.description,
        documentId: input.documentId,
        parentDocumentId: input.parentDocumentId
      )

    case .token(let input):
      model = Token(
        id: input.id,
        value: input.value,
        description: input.description,
        uses: input.uses
      )

    case .tokenScope(let input):
      model = TokenScope(
        id: input.id,
        tokenId: input.tokenId,
        scope: input.scope
      )
    }

    guard model.isValid else {
      throw ModelError.invalidEntity
    }

    try await model.create()
    return .success
  }
}

func nilIfEmpty(_ string: String?) -> String? {
  string?.isEmpty == true ? nil : string
}
