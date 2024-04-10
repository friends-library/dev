import DuetSQL
import FluentSQL
import Foundation

final class PreloadedEntitiesStore: MemoryStore {
  var friends: [Friend.Id: Friend]
  var friendQuotes: [FriendQuote.Id: FriendQuote]
  var friendResidences: [FriendResidence.Id: FriendResidence]
  var friendResidenceDurations: [FriendResidenceDuration.Id: FriendResidenceDuration]
  var documents: [Document.Id: Document]
  var documentTags: [DocumentTag.Id: DocumentTag]
  var relatedDocuments: [RelatedDocument.Id: RelatedDocument]
  var editions: [Edition.Id: Edition]
  var editionImpressions: [EditionImpression.Id: EditionImpression]
  var editionChapters: [EditionChapter.Id: EditionChapter]
  var audios: [Audio.Id: Audio]
  var audioParts: [AudioPart.Id: AudioPart]
  var isbns: [Isbn.Id: Isbn]
  // ⚠️ when adding new properties, make sure you flush them in self.flush()

  init(
    friends: [Friend.Id: Friend] = [:],
    friendQuotes: [FriendQuote.Id: FriendQuote] = [:],
    friendResidences: [FriendResidence.Id: FriendResidence] = [:],
    friendResidenceDurations: [FriendResidenceDuration.Id: FriendResidenceDuration] = [:],
    documents: [Document.Id: Document] = [:],
    documentTags: [DocumentTag.Id: DocumentTag] = [:],
    relatedDocuments: [RelatedDocument.Id: RelatedDocument] = [:],
    editions: [Edition.Id: Edition] = [:],
    editionImpressions: [EditionImpression.Id: EditionImpression] = [:],
    editionChapters: [EditionChapter.Id: EditionChapter] = [:],
    audios: [Audio.Id: Audio] = [:],
    audioParts: [AudioPart.Id: AudioPart] = [:],
    isbns: [Isbn.Id: Isbn] = [:]
  ) {
    self.friends = friends
    self.friendQuotes = friendQuotes
    self.friendResidences = friendResidences
    self.friendResidenceDurations = friendResidenceDurations
    self.documents = documents
    self.documentTags = documentTags
    self.relatedDocuments = relatedDocuments
    self.editions = editions
    self.editionImpressions = editionImpressions
    self.editionChapters = editionChapters
    self.audios = audios
    self.audioParts = audioParts
    self.isbns = isbns

    for var friend in friends.values {
      friend.documents = .loaded([])
      friend.residences = .loaded([])
      friend.quotes = .loaded([])
    }

    for (_, document) in documents {
      document.editions = .loaded([])
      document.tags = .loaded([])
      document.relatedDocuments = .loaded([])
      if var friend = friends[document.friendId] {
        friend.documents.push(document)
        document.friend = .loaded(friend)
      }

      if let altLanguageId = document.altLanguageId,
         let altLanguageDocument = documents[altLanguageId] {
        document.altLanguageDocument = .loaded(altLanguageDocument)
      } else {
        document.altLanguageDocument = .loaded(nil)
      }
    }

    for (_, var residence) in friendResidences {
      residence.durations = .loaded([])
      if var friend = friends[residence.friendId] {
        friend.residences.push(residence)
        residence.friend = .loaded(friend)
      }
    }

    for (_, var duration) in friendResidenceDurations {
      if var residence = friendResidences[duration.friendResidenceId] {
        residence.durations.push(duration)
        duration.residence = .loaded(residence)
      }
    }

    for (_, var quote) in friendQuotes {
      if var friend = friends[quote.friendId] {
        friend.quotes.push(quote)
        quote.friend = .loaded(friend)
      }
    }

    for (_, var tag) in documentTags {
      if let document = documents[tag.documentId] {
        document.tags.push(tag)
        tag.document = .loaded(document)
      }
    }

    for (_, var relatedDocument) in relatedDocuments {
      if var parentDocument = documents[relatedDocument.parentDocumentId] {
        parentDocument.relatedDocuments.push(relatedDocument)
        relatedDocument.parentDocument = .loaded(parentDocument)
      }
      if let document = documents[relatedDocument.documentId] {
        relatedDocument.document = .loaded(document)
      }
    }

    for (_, var edition) in editions {
      // do this BEFORE setting optional children (Impression, Audio)
      edition.chapters = .loaded([])
      edition.impression = .loaded(nil)
      edition.audio = .loaded(nil)
      edition.isbn = .loaded(nil)

      if let document = documents[edition.documentId] {
        document.editions.push(edition)
        edition.document = .loaded(document)
      }
    }

    for (_, var isbn) in isbns {
      if var editionId = isbn.editionId,
         var edition = editions[editionId] {
        edition.isbn = .loaded(isbn)
        isbn.edition = .loaded(edition)
      }
    }

    for (_, var impression) in editionImpressions {
      if var edition = editions[impression.editionId] {
        edition.impression = .loaded(impression)
        impression.edition = .loaded(edition)
      }
    }

    for (_, var audio) in audios {
      audio.parts = .loaded([])
      if var edition = editions[audio.editionId] {
        edition.audio = .loaded(audio)
        audio.edition = .loaded(edition)
      }
    }

    for (_, var chapter) in editionChapters {
      if var edition = editions[chapter.editionId] {
        edition.chapters.push(chapter)
        chapter.edition = .loaded(edition)
      }
    }

    for (_, var audioPart) in audioParts {
      if var audio = audios[audioPart.audioId] {
        audio.parts.push(audioPart)
        audioPart.audio = .loaded(audio)
      }
    }
  }

  func flush() {
    friends = [:]
    friendQuotes = [:]
    friendResidences = [:]
    friendResidenceDurations = [:]
    documents = [:]
    documentTags = [:]
    relatedDocuments = [:]
    editions = [:]
    editionImpressions = [:]
    editionChapters = [:]
    audios = [:]
    audioParts = [:]
    isbns = [:]
  }

  convenience init(
    friends: [Friend] = [],
    friendQuotes: [FriendQuote] = [],
    friendResidences: [FriendResidence] = [],
    friendResidenceDurations: [FriendResidenceDuration] = [],
    documents: [Document] = [],
    documentTags: [DocumentTag] = [],
    relatedDocuments: [RelatedDocument] = [],
    editions: [Edition] = [],
    editionImpressions: [EditionImpression] = [],
    editionChapters: [EditionChapter] = [],
    audios: [Audio] = [],
    audioParts: [AudioPart] = [],
    isbns: [Isbn] = []
  ) {
    self.init(
      friends: toDict(friends),
      friendQuotes: toDict(friendQuotes),
      friendResidences: toDict(friendResidences),
      friendResidenceDurations: toDict(friendResidenceDurations),
      documents: toDict(documents),
      documentTags: toDict(documentTags),
      relatedDocuments: toDict(relatedDocuments),
      editions: toDict(editions),
      editionImpressions: toDict(editionImpressions),
      editionChapters: toDict(editionChapters),
      audios: toDict(audios),
      audioParts: toDict(audioParts),
      isbns: toDict(isbns)
    )
  }

  public func keyPath<M: DuetSQL.Model>(to: M.Type) -> Models<M> {
    switch M.tableName {
    case Friend.tableName:
      return \PreloadedEntitiesStore.friends as! Models<M>
    case FriendQuote.tableName:
      return \PreloadedEntitiesStore.friendQuotes as! Models<M>
    case FriendResidence.tableName:
      return \PreloadedEntitiesStore.friendResidences as! Models<M>
    case FriendResidenceDuration.tableName:
      return \PreloadedEntitiesStore.friendResidenceDurations as! Models<M>
    case Document.tableName:
      return \PreloadedEntitiesStore.documents as! Models<M>
    case DocumentTag.tableName:
      return \PreloadedEntitiesStore.documentTags as! Models<M>
    case RelatedDocument.tableName:
      return \PreloadedEntitiesStore.relatedDocuments as! Models<M>
    case Edition.tableName:
      return \PreloadedEntitiesStore.editions as! Models<M>
    case EditionImpression.tableName:
      return \PreloadedEntitiesStore.editionImpressions as! Models<M>
    case EditionChapter.tableName:
      return \PreloadedEntitiesStore.editionChapters as! Models<M>
    case Audio.tableName:
      return \PreloadedEntitiesStore.audios as! Models<M>
    case AudioPart.tableName:
      return \PreloadedEntitiesStore.audioParts as! Models<M>
    case Isbn.tableName:
      return \PreloadedEntitiesStore.isbns as! Models<M>
    default:
      preconditionFailure()
    }
  }
}

// extensions

extension Children {
  mutating func push(_ child: C) {
    switch self {
    case .notLoaded:
      self = .loaded([child])
    case .loaded(let children):
      self = .loaded(children + [child])
    }
  }
}

// helpers

private func toDict<M: DuetSQL.Model>(_ models: [M]) -> [M.IdValue: M] {
  var dict = Dictionary<M.IdValue, M>.init(minimumCapacity: models.count)
  models.forEach { model in dict[model.id] = model }
  return dict
}

func queryPreloadedEntities(on db: SQLDatabase) async throws -> PreloadedEntitiesStore {
  Current.logger.info("Querying all entities and caching...")
  async let friends = findAll(Friend.self, on: db)
  async let friendQuotes = findAll(FriendQuote.self, on: db)
  async let friendResidences = findAll(FriendResidence.self, on: db)
  async let friendResidenceDurations = findAll(FriendResidenceDuration.self, on: db)
  async let documents = findAll(Document.self, on: db)
  async let documentTags = findAll(DocumentTag.self, on: db)
  async let relatedDocuments = findAll(RelatedDocument.self, on: db)
  async let editions = findAll(Edition.self, on: db)
  async let editionImpressions = findAll(EditionImpression.self, on: db)
  async let editionChapters = findAll(EditionChapter.self, on: db)
  async let audios = findAll(Audio.self, on: db)
  async let audioParts = findAll(AudioPart.self, on: db)
  async let isbns = findAll(Isbn.self, on: db)

  return PreloadedEntitiesStore(
    friends: try await friends,
    friendQuotes: try await friendQuotes,
    friendResidences: try await friendResidences,
    friendResidenceDurations: try await friendResidenceDurations,
    documents: try await documents,
    documentTags: try await documentTags,
    relatedDocuments: try await relatedDocuments,
    editions: try await editions,
    editionImpressions: try await editionImpressions,
    editionChapters: try await editionChapters,
    audios: try await audios,
    audioParts: try await audioParts,
    isbns: try await isbns
  )
}

private func findAll<M: ApiModel>(_ Model: M.Type, on db: SQLDatabase) async throws -> [M] {
  let prepared = SQL.select(.all, from: M.self, where: .notSoftDeleted)
  let rows = try await SQL.execute(prepared, on: db)
  return try rows.compactMap { try $0.decode(Model.self) }
}
