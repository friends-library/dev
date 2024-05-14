import DuetSQL

// TODO: namespace under model: Friend.Joined?

@dynamicMemberLookup
final class JoinedFriend {
  let model: Friend
  let residences: [JoinedFriendResidence]
  let quotes: [FriendQuote]

  #if DEBUG
    var documents: [JoinedDocument]
  #else
    fileprivate(set) var documents: [JoinedDocument]
  #endif

  var directoryPathData: Friend.DirectoryPathData {
    .init(lang: model.lang, slug: model.slug)
  }

  subscript<T>(dynamicMember keyPath: KeyPath<Friend, T>) -> T {
    model[keyPath: keyPath]
  }

  init(
    _ model: Friend,
    residences: [JoinedFriendResidence],
    quotes: [FriendQuote],
    documents: [JoinedDocument] = []
  ) {
    self.model = model
    self.residences = residences
    self.quotes = quotes
    self.documents = documents
  }
}

@dynamicMemberLookup
final class JoinedFriendResidence: Sendable {
  let model: FriendResidence
  let durations: [FriendResidenceDuration]

  subscript<T>(dynamicMember keyPath: KeyPath<FriendResidence, T>) -> T {
    model[keyPath: keyPath]
  }

  init(_ model: FriendResidence, durations: [FriendResidenceDuration]) {
    self.model = model
    self.durations = durations
  }
}

@dynamicMemberLookup
final class JoinedDocument {
  let model: Document
  let tags: [DocumentTag.TagType]

  #if DEBUG
    var altLanguageDocument: JoinedDocument?
    unowned var friend: JoinedFriend
    var editions: [JoinedEdition] = []
    var relatedDocuments: [JoinedRelatedDocument] = []
  #else
    fileprivate(set) var altLanguageDocument: JoinedDocument?
    fileprivate(set) unowned var friend: JoinedFriend
    fileprivate(set) var editions: [JoinedEdition] = []
    fileprivate(set) var relatedDocuments: [JoinedRelatedDocument] = []
  #endif

  var hasNonDraftEdition: Bool {
    editions.contains { !$0.isDraft }
  }

  var primaryEdition: JoinedEdition? {
    let allEditions = editions.filter { $0.isDraft == false }
    return allEditions.first { $0.type == .updated } ??
      allEditions.first { $0.type == .modernized } ??
      allEditions.first
  }

  var directoryPathData: Document.DirectoryPathData {
    .init(friend: friend.directoryPathData, slug: model.slug)
  }

  var directoryPath: String {
    directoryPathData.directoryPath
  }

  var trimmedUtf8ShortTitle: String {
    Asciidoc.trimmedUtf8ShortDocumentTitle(model.title, lang: friend.lang)
  }

  subscript<T>(dynamicMember keyPath: KeyPath<Document, T>) -> T {
    model[keyPath: keyPath]
  }

  init(
    _ model: Document,
    friend: JoinedFriend,
    altLanguageDocument: JoinedDocument? = nil,
    tags: [DocumentTag.TagType]
  ) {
    self.model = model
    self.tags = tags
    self.altLanguageDocument = altLanguageDocument
    self.friend = friend
  }
}

@dynamicMemberLookup
final class JoinedRelatedDocument {
  let model: RelatedDocument
  let document: JoinedDocument
  let parentDocument: JoinedDocument

  subscript<T>(dynamicMember keyPath: KeyPath<RelatedDocument, T>) -> T {
    model[keyPath: keyPath]
  }

  init(
    _ model: RelatedDocument,
    document: JoinedDocument,
    parentDocument: JoinedDocument
  ) {
    self.model = model
    self.document = document
    self.parentDocument = parentDocument
  }
}

@dynamicMemberLookup
final class JoinedEdition {
  let model: Edition
  let chapters: [EditionChapter]
  let isbn: Isbn?

  #if DEBUG
    unowned var document: JoinedDocument
    var impression: JoinedEditionImpression?
    var audio: JoinedAudio?
  #else
    fileprivate(set) unowned var document: JoinedDocument
    fileprivate(set) var impression: JoinedEditionImpression?
    fileprivate(set) var audio: JoinedAudio?
  #endif

  var directoryPathData: Edition.DirectoryPathData {
    .init(document: document.directoryPathData, type: model.type)
  }

  var directoryPath: String {
    directoryPathData.directoryPath
  }

  subscript<T>(dynamicMember keyPath: KeyPath<Edition, T>) -> T {
    model[keyPath: keyPath]
  }

  init(
    _ model: Edition,
    document: JoinedDocument,
    chapters: [EditionChapter],
    isbn: Isbn?,
    impression: JoinedEditionImpression? = nil
  ) {
    self.model = model
    self.document = document
    self.chapters = chapters
    self.isbn = isbn
    self.impression = impression
  }
}

@dynamicMemberLookup
final class JoinedAudio {
  let model: Audio

  #if DEBUG
    var parts: [JoinedAudioPart]
    unowned var edition: JoinedEdition
  #else
    fileprivate(set) var parts: [JoinedAudioPart]
    fileprivate(set) unowned var edition: JoinedEdition
  #endif

  subscript<T>(dynamicMember keyPath: KeyPath<Audio, T>) -> T {
    model[keyPath: keyPath]
  }

  init(_ model: Audio, edition: JoinedEdition, parts: [JoinedAudioPart] = []) {
    self.model = model
    self.edition = edition
    self.parts = parts
  }
}

@dynamicMemberLookup
final class JoinedAudioPart {
  let model: AudioPart

  #if DEBUG
    unowned var audio: JoinedAudio
  #else
    fileprivate(set) unowned var audio: JoinedAudio
  #endif

  subscript<T>(dynamicMember keyPath: KeyPath<AudioPart, T>) -> T {
    model[keyPath: keyPath]
  }

  init(_ model: AudioPart, audio: JoinedAudio) {
    self.model = model
    self.audio = audio
  }
}

@dynamicMemberLookup
final class JoinedEditionImpression {
  let model: EditionImpression

  #if DEBUG
    unowned var edition: JoinedEdition
  #else
    fileprivate(set) unowned var edition: JoinedEdition
  #endif

  subscript<T>(dynamicMember keyPath: KeyPath<EditionImpression, T>) -> T {
    model[keyPath: keyPath]
  }

  init(_ model: EditionImpression, edition: JoinedEdition) {
    self.model = model
    self.edition = edition
  }
}

@globalActor actor JoinedEntities {
  static let shared = JoinedEntities()

  private var loaded = false
  private var joinedFriends: [Friend.Id: JoinedFriend] = [:]
  private var joinedDocuments: [Document.Id: JoinedDocument] = [:]
  private var joinedEditions: [Edition.Id: JoinedEdition] = [:]
  private var joinedImpressions: [EditionImpression.Id: JoinedEditionImpression] = [:]
  private var joinedAudios: [Audio.Id: JoinedAudio] = [:]
  private var joinedAudioParts: [AudioPart.Id: JoinedAudioPart] = [:]

  public func flush() {
    loaded = false
    joinedFriends = [:]
    joinedDocuments = [:]
    joinedEditions = [:]
    joinedImpressions = [:]
    joinedAudios = [:]
    joinedAudioParts = [:]
  }

  public func friends() async throws -> [JoinedFriend] {
    if !loaded { try await load() }
    return Array(joinedFriends.values)
  }

  public func friend(_ id: Friend.Id) async throws -> JoinedFriend {
    if !loaded { try await load() }
    guard let friend = joinedFriends[id] else {
      throw DuetSQLError.notFound("Friend: \(id.lowercased)")
    }
    return friend
  }

  public func documents() async throws -> [JoinedDocument] {
    if !loaded { try await load() }
    return Array(joinedDocuments.values)
  }

  public func document(_ id: Document.Id) async throws -> JoinedDocument {
    if !loaded { try await load() }
    guard let document = joinedDocuments[id] else {
      throw DuetSQLError.notFound("Document: \(id.lowercased)")
    }
    return document
  }

  public func editions() async throws -> [JoinedEdition] {
    if !loaded { try await load() }
    return Array(joinedEditions.values)
  }

  public func editionImpressions() async throws -> [JoinedEditionImpression] {
    if !loaded { try await load() }
    return Array(joinedImpressions.values)
  }

  public func audios() async throws -> [JoinedAudio] {
    if !loaded { try await load() }
    return Array(joinedAudios.values)
  }

  public func editionImpression(
    _ id: EditionImpression.Id
  ) async throws -> JoinedEditionImpression {
    if !loaded { try await load() }
    guard let impression = joinedImpressions[id] else {
      throw DuetSQLError.notFound("EditionImpression: \(id.lowercased)")
    }
    return impression
  }

  public func edition(_ id: Edition.Id) async throws -> JoinedEdition {
    if !loaded { try await load() }
    guard let edition = joinedEditions[id] else {
      throw DuetSQLError.notFound("Edition: \(id.lowercased)")
    }
    return edition
  }

  func load() async throws {
    async let friends = Friend.query().all()
    async let documents = Document.query().all()
    async let editions = Edition.query().all()
    async let chapters = EditionChapter.query().all()
    async let impressions = EditionImpression.query().all()
    async let isbns = Isbn.query().all()
    async let audios = Audio.query().all()
    async let audioParts = AudioPart.query().all()
    async let tags = DocumentTag.query().all()
    async let residences = FriendResidence.query().all()
    async let durations = FriendResidenceDuration.query().all()
    async let relatedDocuments = RelatedDocument.query().all()
    async let quotes = FriendQuote.query().all()

    let residenceDurations = try await durations.reduce(into: [:]) { durations, model in
      durations[model.friendResidenceId, default: []].append(model)
    }

    let joinedResidences = try await residences.reduce(into: [:]) { joined, model in
      joined[model.friendId, default: []]
        .append(JoinedFriendResidence(model, durations: residenceDurations[model.id] ?? []))
    }

    let quotesMap = try await quotes.reduce(into: [:]) { quotes, model in
      quotes[model.friendId, default: []].append(model)
    }

    joinedFriends = try await friends.reduce(into: [:]) { joined, model in
      joined[model.id] = JoinedFriend(
        model,
        residences: joinedResidences[model.id] ?? [],
        quotes: quotesMap[model.id] ?? []
      )
    }

    let documentTags = try await tags.reduce(into: [:]) { tags, model in
      tags[model.documentId, default: []].append(model.type)
    }

    joinedDocuments = try await documents.reduce(into: [:]) { joined, model in
      let friend = joinedFriends[model.friendId]!
      let joinedDocument = JoinedDocument(model, friend: friend, tags: documentTags[model.id] ?? [])
      joined[model.id] = joinedDocument
      friend.documents.append(joinedDocument)
    }

    for doc in joinedDocuments.values {
      if let altLanguageId = doc.altLanguageId {
        doc.altLanguageDocument = joinedDocuments[altLanguageId]
      }
    }

    for relatedDocument in try await relatedDocuments {
      if let document = joinedDocuments[relatedDocument.documentId],
         let parentDocument = joinedDocuments[relatedDocument.parentDocumentId] {
        let joinedRelatedDocument = JoinedRelatedDocument(
          relatedDocument,
          document: document,
          parentDocument: parentDocument
        )
        parentDocument.relatedDocuments.append(joinedRelatedDocument)
      }
    }

    let chapterMap = try await chapters.reduce(into: [:]) { map, model in
      map[model.editionId, default: []].append(model)
    }

    let isbnMap: [Edition.Id: Isbn] = try await isbns.reduce(into: [:]) { map, model in
      if let editionId = model.editionId {
        map[editionId] = model
      }
    }

    joinedEditions = try await editions.reduce(into: [:]) { joined, model in
      let document = joinedDocuments[model.documentId]!
      let joinedEdition = JoinedEdition(
        model,
        document: document,
        chapters: chapterMap[model.id] ?? [],
        isbn: isbnMap[model.id]
      )
      joined[model.id] = joinedEdition
      document.editions.append(joinedEdition)
    }

    joinedImpressions = try await impressions.reduce(into: [:]) { joined, model in
      let edition = joinedEditions[model.editionId]!
      let joinedImpression = JoinedEditionImpression(model, edition: edition)
      joined[model.id] = joinedImpression
      edition.impression = joinedImpression
    }

    joinedAudios = try await audios.reduce(into: [:]) { joined, model in
      let edition = joinedEditions[model.editionId]!
      let joinedAudio = JoinedAudio(model, edition: edition)
      joined[model.id] = joinedAudio
      edition.audio = joinedAudio
    }

    joinedAudioParts = try await audioParts.reduce(into: [:]) { joined, model in
      let audio = joinedAudios[model.audioId]!
      let joinedAudioPart = JoinedAudioPart(model, audio: audio)
      joined[model.id] = joinedAudioPart
      audio.parts.append(joinedAudioPart)
    }

    // swiftformat:disable redundantSelf
    self.loaded = true
  }
}

// SAFETY: the only props that are unsendable `var` are fileprivate(set) and
// setup synchronously in the `load` method, which is isolated to a global actor
extension JoinedFriend: @unchecked Sendable {}
extension JoinedDocument: @unchecked Sendable {}
extension JoinedEdition: @unchecked Sendable {}
extension JoinedAudio: @unchecked Sendable {}
extension JoinedEditionImpression: @unchecked Sendable {}

extension Array where Element: ApiModel {
  var map: [Element.IdValue: Element] {
    reduce(into: [:]) { map, element in
      map[element.id] = element
    }
  }
}
