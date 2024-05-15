import DuetSQL

protocol QueryableJoinedEntity {
  associatedtype Model: ApiModel
  var model: Model { get }
  static func all() async throws -> [Self]
  static func find(_ id: Model.IdValue) async throws -> Self
}

extension Friend {
  @dynamicMemberLookup final class Joined {
    let model: Friend
    let residences: [FriendResidence.Joined]
    let quotes: [FriendQuote]

    #if DEBUG
      var documents: [Document.Joined]
    #else
      fileprivate(set) var documents: [Document.Joined]
    #endif

    init(
      _ model: Friend,
      residences: [FriendResidence.Joined],
      quotes: [FriendQuote],
      documents: [Document.Joined] = []
    ) {
      self.model = model
      self.residences = residences
      self.quotes = quotes
      self.documents = documents
    }
  }
}

extension FriendResidence {
  @dynamicMemberLookup final class Joined: Sendable {
    let model: FriendResidence
    let durations: [FriendResidenceDuration]

    init(_ model: FriendResidence, durations: [FriendResidenceDuration]) {
      self.model = model
      self.durations = durations
    }
  }
}

extension Document {
  @dynamicMemberLookup final class Joined {
    let model: Document
    let tags: [DocumentTag.TagType]

    #if DEBUG
      var altLanguageDocument: Document.Joined?
      unowned var friend: Friend.Joined
      var editions: [Edition.Joined] = []
      var relatedDocuments: [RelatedDocument.Joined] = []
    #else
      fileprivate(set) var altLanguageDocument: Document.Joined?
      fileprivate(set) unowned var friend: Friend.Joined
      fileprivate(set) var editions: [Edition.Joined] = []
      fileprivate(set) var relatedDocuments: [RelatedDocument.Joined] = []
    #endif

    init(
      _ model: Document,
      friend: Friend.Joined,
      altLanguageDocument: Document.Joined? = nil,
      tags: [DocumentTag.TagType]
    ) {
      self.model = model
      self.tags = tags
      self.altLanguageDocument = altLanguageDocument
      self.friend = friend
    }
  }
}

extension RelatedDocument {
  @dynamicMemberLookup final class Joined {
    let model: RelatedDocument
    let document: Document.Joined
    let parentDocument: Document.Joined

    init(
      _ model: RelatedDocument,
      document: Document.Joined,
      parentDocument: Document.Joined
    ) {
      self.model = model
      self.document = document
      self.parentDocument = parentDocument
    }
  }
}

extension Edition {
  @dynamicMemberLookup final class Joined {
    let model: Edition
    let chapters: [EditionChapter]
    let isbn: Isbn?

    #if DEBUG
      unowned var document: Document.Joined
      var impression: EditionImpression.Joined?
      var audio: Audio.Joined?
    #else
      fileprivate(set) unowned var document: Document.Joined
      fileprivate(set) var impression: EditionImpression.Joined?
      fileprivate(set) var audio: Audio.Joined?
    #endif

    init(
      _ model: Edition,
      document: Document.Joined,
      chapters: [EditionChapter],
      isbn: Isbn?,
      impression: EditionImpression.Joined? = nil
    ) {
      self.model = model
      self.document = document
      self.chapters = chapters
      self.isbn = isbn
      self.impression = impression
    }
  }
}

extension Audio {
  @dynamicMemberLookup
  final class Joined {
    let model: Audio

    #if DEBUG
      var parts: [AudioPart.Joined]
      unowned var edition: Edition.Joined
    #else
      fileprivate(set) var parts: [AudioPart.Joined]
      fileprivate(set) unowned var edition: Edition.Joined
    #endif

    init(_ model: Audio, edition: Edition.Joined, parts: [AudioPart.Joined] = []) {
      self.model = model
      self.edition = edition
      self.parts = parts
    }
  }
}

extension AudioPart {
  @dynamicMemberLookup final class Joined {
    let model: AudioPart

    #if DEBUG
      unowned var audio: Audio.Joined
    #else
      fileprivate(set) unowned var audio: Audio.Joined
    #endif

    init(_ model: AudioPart, audio: Audio.Joined) {
      self.model = model
      self.audio = audio
    }
  }
}

extension EditionImpression {
  @dynamicMemberLookup final class Joined {
    let model: EditionImpression

    #if DEBUG
      unowned var edition: Edition.Joined
    #else
      fileprivate(set) unowned var edition: Edition.Joined
    #endif

    init(_ model: EditionImpression, edition: Edition.Joined) {
      self.model = model
      self.edition = edition
    }
  }
}

@globalActor actor JoinedEntityCache {
  static let shared = JoinedEntityCache()

  private var loaded = false
  private var joinedFriends: [Friend.Id: Friend.Joined] = [:]
  private var joinedDocuments: [Document.Id: Document.Joined] = [:]
  private var joinedEditions: [Edition.Id: Edition.Joined] = [:]
  private var joinedImpressions: [EditionImpression.Id: EditionImpression.Joined] = [:]
  private var joinedAudios: [Audio.Id: Audio.Joined] = [:]
  private var joinedAudioParts: [AudioPart.Id: AudioPart.Joined] = [:]

  public func flush() {
    loaded = false
    joinedFriends = [:]
    joinedDocuments = [:]
    joinedEditions = [:]
    joinedImpressions = [:]
    joinedAudios = [:]
    joinedAudioParts = [:]
  }

  fileprivate func friends() async throws -> [Friend.Joined] {
    if !loaded { try await load() }
    return Array(joinedFriends.values)
  }

  fileprivate func friend(_ id: Friend.Id) async throws -> Friend.Joined {
    if !loaded { try await load() }
    guard let friend = joinedFriends[id] else {
      throw DuetSQLError.notFound("Friend: \(id.lowercased)")
    }
    return friend
  }

  fileprivate func documents() async throws -> [Document.Joined] {
    if !loaded { try await load() }
    return Array(joinedDocuments.values)
  }

  fileprivate func document(_ id: Document.Id) async throws -> Document.Joined {
    if !loaded { try await load() }
    guard let document = joinedDocuments[id] else {
      throw DuetSQLError.notFound("Document: \(id.lowercased)")
    }
    return document
  }

  fileprivate func editions() async throws -> [Edition.Joined] {
    if !loaded { try await load() }
    return Array(joinedEditions.values)
  }

  fileprivate func editionImpressions() async throws -> [EditionImpression.Joined] {
    if !loaded { try await load() }
    return Array(joinedImpressions.values)
  }

  fileprivate func editionImpression(
    _ id: EditionImpression.Id
  ) async throws -> EditionImpression.Joined {
    if !loaded { try await load() }
    guard let impression = joinedImpressions[id] else {
      throw DuetSQLError.notFound("EditionImpression: \(id.lowercased)")
    }
    return impression
  }

  fileprivate func audios() async throws -> [Audio.Joined] {
    if !loaded { try await load() }
    return Array(joinedAudios.values)
  }

  fileprivate func audio(_ id: Audio.Id) async throws -> Audio.Joined {
    if !loaded { try await load() }
    guard let audio = joinedAudios[id] else {
      throw DuetSQLError.notFound("Audio: \(id.lowercased)")
    }
    return audio
  }

  fileprivate func edition(_ id: Edition.Id) async throws -> Edition.Joined {
    if !loaded { try await load() }
    guard let edition = joinedEditions[id] else {
      throw DuetSQLError.notFound("Edition: \(id.lowercased)")
    }
    return edition
  }

  private func load() async throws {
    async let asyncFriends = Friend.query().all()
    async let asyncDocuments = Document.query().all()
    async let asyncEditions = Edition.query().all()
    async let asyncChapters = EditionChapter.query().all()
    async let asyncImpressions = EditionImpression.query().all()
    async let asyncIsbns = Isbn.query().all()
    async let asyncAudios = Audio.query().all()
    async let asyncAudioParts = AudioPart.query().all()
    async let asyncTags = DocumentTag.query().all()
    async let asyncResidences = FriendResidence.query().all()
    async let asyncDurations = FriendResidenceDuration.query().all()
    async let asyncRelatedDocuments = RelatedDocument.query().all()
    async let asyncQuotes = FriendQuote.query().all()

    let durations = try await asyncDurations
    let friends = try await asyncFriends
    let documents = try await asyncDocuments
    let editions = try await asyncEditions
    let chapters = try await asyncChapters
    let impressions = try await asyncImpressions
    let isbns = try await asyncIsbns
    let audios = try await asyncAudios
    let audioParts = try await asyncAudioParts
    let tags = try await asyncTags
    let residences = try await asyncResidences
    let relatedDocuments = try await asyncRelatedDocuments
    let quotes = try await asyncQuotes

    let residenceDurations = durations.reduce(into: [:]) { durations, model in
      durations[model.friendResidenceId, default: []].append(model)
    }

    let joinedResidences = residences.reduce(into: [:]) { joined, model in
      joined[model.friendId, default: []]
        .append(FriendResidence.Joined(model, durations: residenceDurations[model.id] ?? []))
    }

    let quotesMap = quotes.reduce(into: [:]) { quotes, model in
      quotes[model.friendId, default: []].append(model)
    }

    joinedFriends = friends.reduce(into: [:]) { joined, model in
      joined[model.id] = Friend.Joined(
        model,
        residences: joinedResidences[model.id] ?? [],
        quotes: quotesMap[model.id] ?? []
      )
    }

    let documentTags = tags.reduce(into: [:]) { tags, model in
      tags[model.documentId, default: []].append(model.type)
    }

    joinedDocuments = documents.reduce(into: [:]) { joined, model in
      let friend = joinedFriends[model.friendId]!
      let joinedDocument = Document.Joined(
        model,
        friend: friend,
        tags: documentTags[model.id] ?? []
      )
      joined[model.id] = joinedDocument
      friend.documents.append(joinedDocument)
    }

    for doc in joinedDocuments.values {
      if let altLanguageId = doc.altLanguageId {
        doc.altLanguageDocument = joinedDocuments[altLanguageId]
      }
    }

    for relatedDocument in relatedDocuments {
      if let document = joinedDocuments[relatedDocument.documentId],
         let parentDocument = joinedDocuments[relatedDocument.parentDocumentId] {
        let joinedRelatedDocument = RelatedDocument.Joined(
          relatedDocument,
          document: document,
          parentDocument: parentDocument
        )
        parentDocument.relatedDocuments.append(joinedRelatedDocument)
      }
    }

    let chapterMap = chapters.reduce(into: [:]) { map, model in
      map[model.editionId, default: []].append(model)
    }

    let isbnMap: [Edition.Id: Isbn] = isbns.reduce(into: [:]) { map, model in
      if let editionId = model.editionId {
        map[editionId] = model
      }
    }

    joinedEditions = editions.reduce(into: [:]) { joined, model in
      let document = joinedDocuments[model.documentId]!
      let joinedEdition = Edition.Joined(
        model,
        document: document,
        chapters: chapterMap[model.id] ?? [],
        isbn: isbnMap[model.id]
      )
      joined[model.id] = joinedEdition
      document.editions.append(joinedEdition)
    }

    joinedImpressions = impressions.reduce(into: [:]) { joined, model in
      let edition = joinedEditions[model.editionId]!
      let joinedImpression = EditionImpression.Joined(model, edition: edition)
      joined[model.id] = joinedImpression
      edition.impression = joinedImpression
    }

    joinedAudios = audios.reduce(into: [:]) { joined, model in
      let edition = joinedEditions[model.editionId]!
      let joinedAudio = Audio.Joined(model, edition: edition)
      joined[model.id] = joinedAudio
      edition.audio = joinedAudio
    }

    joinedAudioParts = audioParts.reduce(into: [:]) { joined, model in
      let audio = joinedAudios[model.audioId]!
      let joinedAudioPart = AudioPart.Joined(model, audio: audio)
      joined[model.id] = joinedAudioPart
      audio.parts.append(joinedAudioPart)
    }

    // swiftformat:disable redundantSelf
    self.loaded = true
  }
}

// extensions

// SAFETY: the only props that are unsendable `var` are fileprivate(set) and
// setup synchronously in the `load` method, which is isolated to a global actor
extension Friend.Joined: @unchecked Sendable {}
extension Document.Joined: @unchecked Sendable {}
extension Edition.Joined: @unchecked Sendable {}
extension Audio.Joined: @unchecked Sendable {}
extension EditionImpression.Joined: @unchecked Sendable {}

extension Array where Element: ApiModel {
  var map: [Element.IdValue: Element] {
    reduce(into: [:]) { map, element in
      map[element.id] = element
    }
  }
}

extension Friend.Joined: QueryableJoinedEntity {
  subscript<T>(dynamicMember keyPath: KeyPath<Friend, T>) -> T {
    model[keyPath: keyPath]
  }

  static func all() async throws -> [Friend.Joined] {
    try await JoinedEntityCache.shared.friends()
  }

  static func find(_ id: Friend.Id) async throws -> Friend.Joined {
    try await JoinedEntityCache.shared.friend(id)
  }
}

extension Document.Joined: QueryableJoinedEntity {
  subscript<T>(dynamicMember keyPath: KeyPath<Document, T>) -> T {
    model[keyPath: keyPath]
  }

  static func all() async throws -> [Document.Joined] {
    try await JoinedEntityCache.shared.documents()
  }

  static func find(_ id: Document.Id) async throws -> Document.Joined {
    try await JoinedEntityCache.shared.document(id)
  }
}

extension Edition.Joined: QueryableJoinedEntity {
  subscript<T>(dynamicMember keyPath: KeyPath<Edition, T>) -> T {
    model[keyPath: keyPath]
  }

  static func all() async throws -> [Edition.Joined] {
    try await JoinedEntityCache.shared.editions()
  }

  static func find(_ id: Edition.Id) async throws -> Edition.Joined {
    try await JoinedEntityCache.shared.edition(id)
  }
}

extension Audio.Joined: QueryableJoinedEntity {
  subscript<T>(dynamicMember keyPath: KeyPath<Audio, T>) -> T {
    model[keyPath: keyPath]
  }

  static func all() async throws -> [Audio.Joined] {
    try await JoinedEntityCache.shared.audios()
  }

  static func find(_ id: Audio.Id) async throws -> Audio.Joined {
    try await JoinedEntityCache.shared.audio(id)
  }
}

extension EditionImpression.Joined: QueryableJoinedEntity {
  subscript<T>(dynamicMember keyPath: KeyPath<EditionImpression, T>) -> T {
    model[keyPath: keyPath]
  }

  static func all() async throws -> [EditionImpression.Joined] {
    try await JoinedEntityCache.shared.editionImpressions()
  }

  static func find(_ id: EditionImpression.Id) async throws -> EditionImpression.Joined {
    try await JoinedEntityCache.shared.editionImpression(id)
  }
}

extension AudioPart.Joined {
  subscript<T>(dynamicMember keyPath: KeyPath<AudioPart, T>) -> T {
    model[keyPath: keyPath]
  }
}

extension FriendResidence.Joined {
  subscript<T>(dynamicMember keyPath: KeyPath<FriendResidence, T>) -> T {
    model[keyPath: keyPath]
  }
}

extension RelatedDocument.Joined {
  subscript<T>(dynamicMember keyPath: KeyPath<RelatedDocument, T>) -> T {
    model[keyPath: keyPath]
  }
}
