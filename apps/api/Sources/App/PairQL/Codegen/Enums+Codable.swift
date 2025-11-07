// auto-generated, do not edit
import Foundation
import Tagged

extension DeleteEntities.Input {
  private struct _NamedCase: Codable {
    var `case`: String
    static func extract(from decoder: Decoder) throws -> String {
      let container = try decoder.singleValueContainer()
      return try container.decode(_NamedCase.self).case
    }
  }

  private struct _TypeScriptDecodeError: Error {
    var message: String
  }

  private struct _CaseEditionImpression: Codable {
    var `case` = "editionImpression"
    var id: Tagged<App.EditionImpression, UUID>
  }

  private struct _CaseEditionChapters: Codable {
    var `case` = "editionChapters"
    var id: Tagged<App.Edition, UUID>
  }

  func encode(to encoder: Encoder) throws {
    switch self {
    case .editionImpression(let id):
      try _CaseEditionImpression(id: id).encode(to: encoder)
    case .editionChapters(let id):
      try _CaseEditionChapters(id: id).encode(to: encoder)
    }
  }

  init(from decoder: Decoder) throws {
    let caseName = try _NamedCase.extract(from: decoder)
    let container = try decoder.singleValueContainer()
    switch caseName {
    case "editionImpression":
      let value = try container.decode(_CaseEditionImpression.self)
      self = .editionImpression(id: value.id)
    case "editionChapters":
      let value = try container.decode(_CaseEditionChapters.self)
      self = .editionChapters(id: value.id)
    default:
      throw _TypeScriptDecodeError(message: "Unexpected case name: `\(caseName)`")
    }
  }
}

extension AdminRoute.Upsert {
  private struct _NamedCase: Codable {
    var `case`: String
    static func extract(from decoder: Decoder) throws -> String {
      let container = try decoder.singleValueContainer()
      return try container.decode(_NamedCase.self).case
    }
  }

  private struct _TypeScriptDecodeError: Error {
    var message: String
  }

  private struct _CaseAudio: Codable {
    var `case` = "audio"
    var entity: AdminRoute.Upsert.AudioInput
  }

  private struct _CaseAudioPart: Codable {
    var `case` = "audioPart"
    var entity: AdminRoute.Upsert.AudioPartInput
  }

  private struct _CaseDocument: Codable {
    var `case` = "document"
    var entity: AdminRoute.Upsert.DocumentInput
  }

  private struct _CaseDocumentTag: Codable {
    var `case` = "documentTag"
    var entity: AdminRoute.Upsert.DocumentTagInput
  }

  private struct _CaseEdition: Codable {
    var `case` = "edition"
    var entity: AdminRoute.Upsert.EditionInput
  }

  private struct _CaseFriend: Codable {
    var `case` = "friend"
    var entity: AdminRoute.Upsert.FriendInput
  }

  private struct _CaseFriendQuote: Codable {
    var `case` = "friendQuote"
    var entity: AdminRoute.Upsert.FriendQuoteInput
  }

  private struct _CaseFriendResidence: Codable {
    var `case` = "friendResidence"
    var entity: AdminRoute.Upsert.FriendResidenceInput
  }

  private struct _CaseFriendResidenceDuration: Codable {
    var `case` = "friendResidenceDuration"
    var entity: AdminRoute.Upsert.FriendResidenceDurationInput
  }

  private struct _CaseRelatedDocument: Codable {
    var `case` = "relatedDocument"
    var entity: AdminRoute.Upsert.RelatedDocumentInput
  }

  private struct _CaseToken: Codable {
    var `case` = "token"
    var entity: AdminRoute.Upsert.TokenInput
  }

  private struct _CaseTokenScope: Codable {
    var `case` = "tokenScope"
    var entity: AdminRoute.Upsert.TokenScopeInput
  }

  func encode(to encoder: Encoder) throws {
    switch self {
    case .audio(let entity):
      try _CaseAudio(entity: entity).encode(to: encoder)
    case .audioPart(let entity):
      try _CaseAudioPart(entity: entity).encode(to: encoder)
    case .document(let entity):
      try _CaseDocument(entity: entity).encode(to: encoder)
    case .documentTag(let entity):
      try _CaseDocumentTag(entity: entity).encode(to: encoder)
    case .edition(let entity):
      try _CaseEdition(entity: entity).encode(to: encoder)
    case .friend(let entity):
      try _CaseFriend(entity: entity).encode(to: encoder)
    case .friendQuote(let entity):
      try _CaseFriendQuote(entity: entity).encode(to: encoder)
    case .friendResidence(let entity):
      try _CaseFriendResidence(entity: entity).encode(to: encoder)
    case .friendResidenceDuration(let entity):
      try _CaseFriendResidenceDuration(entity: entity).encode(to: encoder)
    case .relatedDocument(let entity):
      try _CaseRelatedDocument(entity: entity).encode(to: encoder)
    case .token(let entity):
      try _CaseToken(entity: entity).encode(to: encoder)
    case .tokenScope(let entity):
      try _CaseTokenScope(entity: entity).encode(to: encoder)
    }
  }

  init(from decoder: Decoder) throws {
    let caseName = try _NamedCase.extract(from: decoder)
    let container = try decoder.singleValueContainer()
    switch caseName {
    case "audio":
      let value = try container.decode(_CaseAudio.self)
      self = .audio(entity: value.entity)
    case "audioPart":
      let value = try container.decode(_CaseAudioPart.self)
      self = .audioPart(entity: value.entity)
    case "document":
      let value = try container.decode(_CaseDocument.self)
      self = .document(entity: value.entity)
    case "documentTag":
      let value = try container.decode(_CaseDocumentTag.self)
      self = .documentTag(entity: value.entity)
    case "edition":
      let value = try container.decode(_CaseEdition.self)
      self = .edition(entity: value.entity)
    case "friend":
      let value = try container.decode(_CaseFriend.self)
      self = .friend(entity: value.entity)
    case "friendQuote":
      let value = try container.decode(_CaseFriendQuote.self)
      self = .friendQuote(entity: value.entity)
    case "friendResidence":
      let value = try container.decode(_CaseFriendResidence.self)
      self = .friendResidence(entity: value.entity)
    case "friendResidenceDuration":
      let value = try container.decode(_CaseFriendResidenceDuration.self)
      self = .friendResidenceDuration(entity: value.entity)
    case "relatedDocument":
      let value = try container.decode(_CaseRelatedDocument.self)
      self = .relatedDocument(entity: value.entity)
    case "token":
      let value = try container.decode(_CaseToken.self)
      self = .token(entity: value.entity)
    case "tokenScope":
      let value = try container.decode(_CaseTokenScope.self)
      self = .tokenScope(entity: value.entity)
    default:
      throw _TypeScriptDecodeError(message: "Unexpected case name: `\(caseName)`")
    }
  }
}

extension NewsFeedItems.NewsFeedItem.Kind {
  private struct _NamedCase: Codable {
    var `case`: String
    static func extract(from decoder: Decoder) throws -> String {
      let container = try decoder.singleValueContainer()
      return try container.decode(_NamedCase.self).case
    }
  }

  private struct _TypeScriptDecodeError: Error {
    var message: String
  }

  private struct _CaseSpanishTranslation: Codable {
    var `case` = "spanishTranslation"
    var isCompilation: Bool
    var friendName: String
    var englishHtmlShortTitle: String
  }

  func encode(to encoder: Encoder) throws {
    switch self {
    case .spanishTranslation(let isCompilation, let friendName, let englishHtmlShortTitle):
      try _CaseSpanishTranslation(
        isCompilation: isCompilation,
        friendName: friendName,
        englishHtmlShortTitle: englishHtmlShortTitle,
      ).encode(to: encoder)
    case .book:
      try _NamedCase(case: "book").encode(to: encoder)
    case .audiobook:
      try _NamedCase(case: "audiobook").encode(to: encoder)
    }
  }

  init(from decoder: Decoder) throws {
    let caseName = try _NamedCase.extract(from: decoder)
    let container = try decoder.singleValueContainer()
    switch caseName {
    case "spanishTranslation":
      let value = try container.decode(_CaseSpanishTranslation.self)
      self = .spanishTranslation(
        isCompilation: value.isCompilation,
        friendName: value.friendName,
        englishHtmlShortTitle: value.englishHtmlShortTitle,
      )
    case "book":
      self = .book
    case "audiobook":
      self = .audiobook
    default:
      throw _TypeScriptDecodeError(message: "Unexpected case name: `\(caseName)`")
    }
  }
}

extension GetPrintJobExploratoryMetadata.Output {
  private struct _NamedCase: Codable {
    var `case`: String
    static func extract(from decoder: Decoder) throws -> String {
      let container = try decoder.singleValueContainer()
      return try container.decode(_NamedCase.self).case
    }
  }

  private struct _TypeScriptDecodeError: Error {
    var message: String
  }

  private struct _CaseSuccess: Codable {
    var `case` = "success"
    var metadata: PrintJobs.ExploratoryMetadata
  }

  private struct _CaseShippingAddressError: Codable {
    var `case` = "shippingAddressError"
    var message: String
  }

  func encode(to encoder: Encoder) throws {
    switch self {
    case .success(let metadata):
      try _CaseSuccess(metadata: metadata).encode(to: encoder)
    case .shippingAddressError(let unflat):
      try _CaseShippingAddressError(message: unflat.message).encode(to: encoder)
    case .shippingNotPossible:
      try _NamedCase(case: "shippingNotPossible").encode(to: encoder)
    }
  }

  init(from decoder: Decoder) throws {
    let caseName = try _NamedCase.extract(from: decoder)
    let container = try decoder.singleValueContainer()
    switch caseName {
    case "success":
      let value = try container.decode(_CaseSuccess.self)
      self = .success(metadata: value.metadata)
    case "shippingAddressError":
      let value = try container.decode(_CaseShippingAddressError.self)
      self = .shippingAddressError(.init(message: value.message))
    case "shippingNotPossible":
      self = .shippingNotPossible
    default:
      throw _TypeScriptDecodeError(message: "Unexpected case name: `\(caseName)`")
    }
  }
}
