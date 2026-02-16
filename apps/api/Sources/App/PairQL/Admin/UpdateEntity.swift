import Foundation
import PairQL
import TaggedTime

struct UpdateEntity: Pair {
  static let auth: Scope = .queryTokens
  typealias Input = AdminRoute.Upsert
}

// resolver

extension UpdateEntity: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(self.auth)
    let model: any ApiModel

    switch input {
    case .audio(let input):
      var audio = try await context.db.find(input.id)
      audio.editionId = input.editionId
      audio.reader = input.reader
      audio.mp3ZipSizeHq = input.mp3ZipSizeHq
      audio.mp3ZipSizeLq = input.mp3ZipSizeLq
      audio.m4bSizeHq = input.m4bSizeHq
      audio.m4bSizeLq = input.m4bSizeLq
      audio.isIncomplete = input.isIncomplete
      model = audio

    case .audioPart(let input):
      var audioPart = try await context.db.find(input.id)
      audioPart.audioId = input.audioId
      audioPart.title = input.title
      audioPart.duration = input.duration
      audioPart.chapters = try .fromArray(input.chapters)
      audioPart.order = input.order
      audioPart.mp3SizeHq = input.mp3SizeHq
      audioPart.mp3SizeLq = input.mp3SizeLq
      model = audioPart

    case .document(let input):
      var document = try await context.db.find(input.id)
      document.friendId = input.friendId
      document.altLanguageId = input.altLanguageId
      document.title = input.title
      document.slug = input.slug
      document.filename = input.filename
      document.published = input.published
      document.originalTitle = input.originalTitle
      document.incomplete = input.incomplete
      document.description = input.description
      document.partialDescription = input.partialDescription
      document.featuredDescription = input.featuredDescription
      model = document

    case .documentTag(let input):
      var documentTag = try await context.db.find(input.id)
      documentTag.documentId = input.documentId
      documentTag.type = input.type
      model = documentTag

    case .edition(let input):
      var edition = try await context.db.find(input.id)
      edition.documentId = input.documentId
      edition.type = input.type
      edition.editor = input.editor
      edition.isDraft = input.isDraft
      edition.paperbackSplits = try input.paperbackSplits.map { try .fromArray($0) }
      edition.paperbackOverrideSize = input.paperbackOverrideSize
      model = edition

    case .friend(let input):
      var friend = try await context.db.find(input.id)
      friend.lang = input.lang
      friend.name = input.name
      friend.slug = input.slug
      friend.gender = input.gender
      friend.description = input.description
      friend.born = input.born
      friend.died = input.died
      friend.published = input.published
      model = friend

    case .friendQuote(let input):
      var friendQuote = try await context.db.find(input.id)
      friendQuote.friendId = input.friendId
      friendQuote.source = input.source
      friendQuote.text = input.text
      friendQuote.order = input.order
      friendQuote.context = input.context
      model = friendQuote

    case .friendResidence(let input):
      var friendResidence = try await context.db.find(input.id)
      friendResidence.friendId = input.friendId
      friendResidence.city = input.city
      friendResidence.region = input.region
      model = friendResidence

    case .friendResidenceDuration(let input):
      var duration = try await context.db.find(input.id)
      duration.friendResidenceId = input.friendResidenceId
      duration.start = input.start
      duration.end = input.end
      model = duration

    case .relatedDocument(let input):
      var relatedDocument = try await context.db.find(input.id)
      relatedDocument.description = input.description
      relatedDocument.documentId = input.documentId
      relatedDocument.parentDocumentId = input.parentDocumentId
      model = relatedDocument

    case .token(let input):
      var token = try await context.db.find(input.id)
      token.value = input.value
      token.uses = input.uses
      token.description = input.description
      model = token

    case .tokenScope(let input):
      var tokenScope = try await context.db.find(input.id)
      tokenScope.tokenId = input.tokenId
      tokenScope.scope = input.scope
      model = tokenScope
    }

    guard await model.isValid() else {
      throw ModelError.invalidEntity
    }

    try await context.db.update(model)

    return .success
  }
}
