import Duet

@dynamicMemberLookup
final class JoinedFriend {
  let model: Friend
  let residences: [JoinedFriendResidence]
  fileprivate(set) var documents: [JoinedDocument]

  subscript<T>(dynamicMember keyPath: KeyPath<Friend, T>) -> T {
    model[keyPath: keyPath]
  }

  init(
    _ model: Friend,
    residences: [JoinedFriendResidence],
    documents: [JoinedDocument] = []
  ) {
    self.model = model
    self.residences = residences
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
  fileprivate(set) var altLanguage: JoinedDocument?
  fileprivate(set) unowned var friend: JoinedFriend
  fileprivate(set) var editions: [JoinedEdition] = []

  var hasNonDraftEdition: Bool {
    editions.contains { !$0.isDraft }
  }

  var primaryEdition: JoinedEdition? {
    let allEditions = editions.filter { $0.isDraft == false }
    return allEditions.first { $0.type == .updated } ??
      allEditions.first { $0.type == .modernized } ??
      allEditions.first
  }

  subscript<T>(dynamicMember keyPath: KeyPath<Document, T>) -> T {
    model[keyPath: keyPath]
  }

  init(
    _ model: Document,
    friend: JoinedFriend,
    altLanguage: JoinedDocument? = nil,
    tags: [DocumentTag.TagType]
  ) {
    self.model = model
    self.tags = tags
    self.altLanguage = altLanguage
    self.friend = friend
  }
}

@dynamicMemberLookup
final class JoinedEdition {
  let model: Edition
  fileprivate(set) unowned var document: JoinedDocument?
  fileprivate(set) var isbn: JoinedIsbn?
  fileprivate(set) var impression: JoinedEditionImpression?
  fileprivate(set) var audio: JoinedAudio?

  subscript<T>(dynamicMember keyPath: KeyPath<Edition, T>) -> T {
    model[keyPath: keyPath]
  }

  init(
    _ model: Edition,
    document: JoinedDocument,
    isbn: JoinedIsbn? = nil,
    impression: JoinedEditionImpression? = nil
  ) {
    self.model = model
    self.document = document
    self.isbn = isbn
    self.impression = impression
  }
}

@dynamicMemberLookup
final class JoinedAudio {
  let model: Audio
  fileprivate(set) unowned var edition: JoinedEdition

  subscript<T>(dynamicMember keyPath: KeyPath<Audio, T>) -> T {
    model[keyPath: keyPath]
  }

  init(_ model: Audio, edition: JoinedEdition) {
    self.model = model
    self.edition = edition
  }
}

@dynamicMemberLookup
final class JoinedEditionImpression {
  let model: EditionImpression
  fileprivate(set) unowned var edition: JoinedEdition

  subscript<T>(dynamicMember keyPath: KeyPath<EditionImpression, T>) -> T {
    model[keyPath: keyPath]
  }

  init(_ model: EditionImpression, edition: JoinedEdition) {
    self.model = model
    self.edition = edition
  }
}

// todo, unjoin?
@dynamicMemberLookup
final class JoinedIsbn {
  let model: Isbn
  fileprivate(set) unowned var edition: JoinedEdition?

  subscript<T>(dynamicMember keyPath: KeyPath<Isbn, T>) -> T {
    model[keyPath: keyPath]
  }

  init(_ model: Isbn, edition: JoinedEdition?) {
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
  private var joinedIsbns: [Isbn.Id: JoinedIsbn] = [:]
  private var joinedAudios: [Audio.Id: JoinedAudio] = [:]
  // private var joinedResidences: [FriendResidence.Id: JoinedFriendResidence] = [:]

  public func load() async throws {
    async let friends = Friend.query().all()
    async let documents = Document.query().all()
    async let editions = Edition.query().all()
    async let impressions = EditionImpression.query().all()
    async let isbns = Isbn.query().all()
    async let audios = Audio.query().all()
    async let tags = DocumentTag.query().all()
    async let residences = FriendResidence.query().all()
    async let durations = FriendResidenceDuration.query().all()

    let residenceDurations = try await durations.reduce(into: [:]) { durations, model in
      durations[model.friendResidenceId, default: []].append(model)
    }

    let joinedResidences = try await residences.reduce(into: [:]) { joined, model in
      joined[model.friendId, default: []]
        .append(JoinedFriendResidence(model, durations: residenceDurations[model.id] ?? []))
    }

    joinedFriends = try await friends.reduce(into: [:]) { joined, model in
      joined[model.id] = JoinedFriend(model, residences: joinedResidences[model.id] ?? [])
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
        doc.altLanguage = joinedDocuments[altLanguageId]
      }
    }

    joinedEditions = try await editions.reduce(into: [:]) { joined, model in
      let document = joinedDocuments[model.documentId]!
      let joinedEdition = JoinedEdition(model, document: document)
      joined[model.id] = joinedEdition
      document.editions.append(joinedEdition)
    }

    joinedImpressions = try await impressions.reduce(into: [:]) { joined, model in
      let edition = joinedEditions[model.editionId]!
      let joinedImpression = JoinedEditionImpression(model, edition: edition)
      joined[model.id] = joinedImpression
      edition.impression = joinedImpression
    }

    joinedIsbns = try await isbns.reduce(into: [:]) { joined, model in
      let joinedIsbn = JoinedIsbn(model, edition: model.editionId.flatMap { joinedEditions[$0] })
      joined[model.id] = joinedIsbn
      if let edition = joinedIsbn.edition {
        edition.isbn = joinedIsbn
      }
    }

    joinedAudios = try await audios.reduce(into: [:]) { joined, model in
      let edition = joinedEditions[model.editionId]!
      let joinedAudio = JoinedAudio(model, edition: edition)
      joined[model.id] = joinedAudio
      edition.audio = joinedAudio
    }

    loaded = true
  }

  public func friends(
    where predicate: (@Sendable (Friend) -> Bool)? = nil
  ) async throws -> [JoinedFriend] {
    if !loaded { try await load() }
    if let predicate {
      return joinedFriends.values.filter { predicate($0.model) }
    } else {
      return Array(joinedFriends.values)
    }
  }

  public func documents(
    where predicate: (@Sendable (Document) -> Bool)? = nil
  ) async throws -> [JoinedDocument] {
    if !loaded { try await load() }
    if let predicate {
      return joinedDocuments.values.filter { predicate($0.model) }
    } else {
      return Array(joinedDocuments.values)
    }
  }
}

extension JoinedFriend: @unchecked Sendable {}
extension JoinedDocument: @unchecked Sendable {}
extension JoinedEdition: @unchecked Sendable {}
extension JoinedIsbn: @unchecked Sendable {}
extension JoinedEditionImpression: @unchecked Sendable {}

extension Array where Element: ApiModel {
  var map: [Element.IdValue: Element] {
    reduce(into: [:]) { map, element in
      map[element.id] = element
    }
  }
}
