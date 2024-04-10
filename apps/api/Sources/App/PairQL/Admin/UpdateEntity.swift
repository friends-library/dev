import Foundation
import PairQL
import TaggedTime

struct UpdateEntity: Pair {
  static var auth: Scope = .queryTokens
  typealias Input = AdminRoute.Upsert
}

// resolver

extension UpdateEntity: Resolver {
  static func resolve(with input: Input, in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    let model: any ApiModel

    switch input {
    case .audio(let input):
      var audio = try await Audio.find(input.id)
      audio.editionId = input.editionId
      audio.reader = input.reader
      audio.mp3ZipSizeHq = input.mp3ZipSizeHq
      audio.mp3ZipSizeLq = input.mp3ZipSizeLq
      audio.m4bSizeHq = input.m4bSizeHq
      audio.m4bSizeLq = input.m4bSizeLq
      audio.isIncomplete = input.isIncomplete
      model = audio

    case .audioPart(let input):
      var audioPart = try await AudioPart.find(input.id)
      audioPart.audioId = input.audioId
      audioPart.title = input.title
      audioPart.duration = input.duration
      audioPart.chapters = try .fromArray(input.chapters)
      audioPart.order = input.order
      audioPart.mp3SizeHq = input.mp3SizeHq
      audioPart.mp3SizeLq = input.mp3SizeLq
      model = audioPart

    case .document(let input):
      let document = try await Document.find(input.id)
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
      let documentTag = try await DocumentTag.find(input.id)
      documentTag.documentId = input.documentId
      documentTag.type = input.type
      model = documentTag

    case .edition(let input):
      let edition = try await Edition.find(input.id)
      edition.documentId = input.documentId
      edition.type = input.type
      edition.editor = input.editor
      edition.isDraft = input.isDraft
      edition.paperbackSplits = try input.paperbackSplits.map { try .fromArray($0) }
      edition.paperbackOverrideSize = input.paperbackOverrideSize
      model = edition

    case .friend(let input):
      let friend = try await Friend.find(input.id)
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
      let friendQuote = try await FriendQuote.find(input.id)
      friendQuote.friendId = input.friendId
      friendQuote.source = input.source
      friendQuote.text = input.text
      friendQuote.order = input.order
      friendQuote.context = input.context
      model = friendQuote

    case .friendResidence(let input):
      let friendResidence = try await FriendResidence.find(input.id)
      friendResidence.friendId = input.friendId
      friendResidence.city = input.city
      friendResidence.region = input.region
      model = friendResidence

    case .friendResidenceDuration(let input):
      let duration = try await FriendResidenceDuration.find(input.id)
      duration.friendResidenceId = input.friendResidenceId
      duration.start = input.start
      duration.end = input.end
      model = duration

    case .relatedDocument(let input):
      let relatedDocument = try await RelatedDocument.find(input.id)
      relatedDocument.description = input.description
      relatedDocument.documentId = input.documentId
      relatedDocument.parentDocumentId = input.parentDocumentId
      model = relatedDocument

    case .token(let input):
      let token = try await Token.find(input.id)
      token.value = input.value
      token.uses = input.uses
      token.description = input.description
      model = token

    case .tokenScope(let input):
      var tokenScope = try await TokenScope.find(input.id)
      tokenScope.tokenId = input.tokenId
      tokenScope.scope = input.scope
      model = tokenScope
    }

    guard model.isValid else {
      // necessary because models above are reference types, and the
      // mutations would persist in the in-memory db store, unless flushed
      try await Current.db.clearEntityCache()
      throw ModelError.invalidEntity
    }

    try await model.save()

    return .success
  }
}
