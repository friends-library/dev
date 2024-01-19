import Foundation
import PairQL
import TaggedTime

extension AdminRoute {
  enum EntityType: String, PairNestable {
    case friendQuote
    case friendResidence
    case friendResidenceDuration
    case document
    case documentTag
    case relatedDocument
    case edition
    case audio
    case audioPart
    case token
    case tokenScope
    case friend
  }
}

extension AdminRoute {
  enum Upsert: PairInput, PairNestable {
    case audio(entity: AudioInput)
    case audioPart(entity: AudioPartInput)
    case document(entity: DocumentInput)
    case documentTag(entity: DocumentTagInput)
    case edition(entity: EditionInput)
    case friend(entity: FriendInput)
    case friendQuote(entity: FriendQuoteInput)
    case friendResidence(entity: FriendResidenceInput)
    case friendResidenceDuration(entity: FriendResidenceDurationInput)
    case relatedDocument(entity: RelatedDocumentInput)
    case token(entity: TokenInput)
    case tokenScope(entity: TokenScopeInput)

    struct TokenInput: PairNestable {
      let id: Token.Id
      let value: Token.Value
      let uses: Int?
      let description: String
    }

    struct TokenScopeInput: PairNestable {
      let id: TokenScope.Id
      let tokenId: Token.Id
      let scope: Scope
    }

    struct AudioInput: PairNestable {
      let id: Audio.Id
      let editionId: Edition.Id
      let isIncomplete: Bool
      let m4bSizeHq: Bytes
      let m4bSizeLq: Bytes
      let mp3ZipSizeHq: Bytes
      let mp3ZipSizeLq: Bytes
      let reader: String
    }

    struct AudioPartInput: PairNestable {
      let id: AudioPart.Id
      let audioId: Audio.Id
      let chapters: [Int]
      let duration: Seconds<Double>
      let mp3SizeHq: Bytes
      let mp3SizeLq: Bytes
      let order: Int
      let title: String
    }

    struct DocumentInput: PairNestable {
      let id: Document.Id
      let friendId: Friend.Id
      let altLanguageId: Document.Id?
      let description: String
      let featuredDescription: String?
      let filename: String
      let incomplete: Bool
      let originalTitle: String?
      let partialDescription: String
      let published: Int?
      let slug: String
      let title: String
    }

    struct DocumentTagInput: PairNestable {
      let id: DocumentTag.Id
      let documentId: Document.Id
      let type: DocumentTag.TagType
    }

    struct EditionInput: PairNestable {
      let id: Edition.Id
      let documentId: Document.Id
      let type: EditionType
      let editor: String?
      let isDraft: Bool
      let paperbackOverrideSize: PrintSizeVariant?
      let paperbackSplits: [Int]?
    }

    struct FriendInput: PairNestable {
      let id: Friend.Id
      let description: String
      let died: Int?
      let born: Int?
      let gender: Friend.Gender
      let lang: Lang
      let name: String
      let slug: String
      let published: Date?
    }

    struct FriendQuoteInput: PairNestable {
      let id: FriendQuote.Id
      let friendId: Friend.Id
      let context: String?
      let order: Int
      let source: String
      let text: String
    }

    struct FriendResidenceDurationInput: PairNestable {
      let id: FriendResidenceDuration.Id
      let friendResidenceId: FriendResidence.Id
      let end: Int
      let start: Int
    }

    struct FriendResidenceInput: PairNestable {
      let id: FriendResidence.Id
      let friendId: Friend.Id
      let city: String
      let region: String
    }

    struct RelatedDocumentInput: PairNestable {
      let id: RelatedDocument.Id
      let documentId: Document.Id
      let parentDocumentId: Document.Id
      let description: String
    }

    var entityType: AdminRoute.EntityType {
      switch self {
      case .audio: return .audio
      case .audioPart: return .audioPart
      case .document: return .document
      case .documentTag: return .documentTag
      case .edition: return .edition
      case .friend: return .friend
      case .friendQuote: return .friendQuote
      case .friendResidence: return .friendResidence
      case .friendResidenceDuration: return .friendResidenceDuration
      case .relatedDocument: return .relatedDocument
      case .token: return .token
      case .tokenScope: return .tokenScope
      }
    }
  }
}

// extensions

extension AdminRoute.EntityType {
  var modelType: any ApiModel.Type {
    switch self {
    case .friendQuote: return FriendQuote.self
    case .friendResidence: return FriendResidence.self
    case .friendResidenceDuration: return FriendResidenceDuration.self
    case .document: return Document.self
    case .documentTag: return DocumentTag.self
    case .relatedDocument: return RelatedDocument.self
    case .edition: return Edition.self
    case .audio: return Audio.self
    case .audioPart: return AudioPart.self
    case .token: return Token.self
    case .tokenScope: return TokenScope.self
    case .friend: return Friend.self
    }
  }
}
