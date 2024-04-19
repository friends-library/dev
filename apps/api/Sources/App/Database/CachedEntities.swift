import Duet

@dynamicMemberLookup
final class MutBox<T: Sendable> {
  private var value: T
  private var _sealed: Box<T>?

  init(_ value: T) {
    self.value = value
  }

  subscript<U>(dynamicMember keyPath: WritableKeyPath<T, U>) -> U {
    get { value[keyPath: keyPath] }
    set { value[keyPath: keyPath] = newValue }
  }

  var sealed: Box<T> {
    if let sealed = _sealed {
      return sealed
    } else {
      let sealed = Box(value)
      self._sealed = sealed
      return sealed
    }
  }
}

@dynamicMemberLookup
final class Box<T: Sendable>: Sendable {
  let value: T

  init(_ value: T) {
    self.value = value
  }

  subscript<U>(dynamicMember keyPath: KeyPath<T, U>) -> U {
    value[keyPath: keyPath]
  }
}

struct Person: Sendable {
  var name: String
  var age: Int
}

func test() {
  let boxm = MutBox(Person(name: "Alice", age: 30))
  boxm.age += 1
  boxm.name = "Bob"
  // let box = boxm.sealed
  // box.age += 1
  // print(box.value)
}

struct BJoinedFriend: Sendable {
  var model: Box<Friend>
}

struct MutJoinedFriend {
  var model: MutBox<Friend>
  // var documents: [JoinedDocument] = []

  func sealed() -> BJoinedFriend {
    BJoinedFriend(model: model.sealed)
  }
}

@dynamicMemberLookup
class JoinedFriend {
  let model: Friend
  fileprivate(set) var documents: [JoinedDocument] = []

  subscript<T>(dynamicMember keyPath: KeyPath<Friend, T>) -> T {
    model[keyPath: keyPath]
  }

  init(model: Friend) {
    self.model = model
  }
}

extension JoinedFriend: @unchecked Sendable {}

@dynamicMemberLookup
struct JoinedDocument {
  var model: Document
  var altLanguage: Document?
  var friend: JoinedFriend
  var editions: [JoinedEdition] = []

  subscript<T>(dynamicMember keyPath: KeyPath<Document, T>) -> T {
    model[keyPath: keyPath]
  }
}

@dynamicMemberLookup
struct JoinedEdition {
  var model: Edition
  var document: JoinedDocument
  @Boxed var isbn: JoinedIsbn?
  @Boxed var impression: JoinedEditionImpression?

  subscript<T>(dynamicMember keyPath: KeyPath<Edition, T>) -> T {
    model[keyPath: keyPath]
  }
}

@dynamicMemberLookup
struct JoinedEditionImpression {
  var model: EditionImpression
  var edition: JoinedEdition

  subscript<T>(dynamicMember keyPath: KeyPath<EditionImpression, T>) -> T {
    model[keyPath: keyPath]
  }
}

@dynamicMemberLookup
struct JoinedIsbn {
  var model: Isbn
  var edition: JoinedEdition?

  subscript<T>(dynamicMember keyPath: KeyPath<Isbn, T>) -> T {
    model[keyPath: keyPath]
  }
}

@globalActor
actor EntitiesActor {
  static let shared = EntitiesActor()

  private var loaded = false
  private var friends: [Friend.Id: Friend] = [:]
  private var documents: [Document.Id: Document] = [:]

  func load() async throws {
    guard !loaded else { return }
    async let friends = Friend.query().all()
    async let documents = Document.query().all()
    self.friends = try await friends.map
    self.documents = try await documents.map
  }

  public func documents(where predicate: (@Sendable (Document) -> Bool)?) async throws
    -> [Document] {
    if !loaded { try await load() }
    if let predicate {
      return documents.values.filter(predicate)
    } else {
      return Array(documents.values)
    }
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

  public func friends(predicate: (@Sendable (Friend) -> Bool)? = nil) async throws
    -> [JoinedFriend] {
    if !loaded { try await load() }
    if let predicate {
      return joinedFriends.values.filter { predicate($0.model) }
    } else {
      return Array(joinedFriends.values)
    }
  }

  public func documents(predicate: ((Document) -> Bool)?) -> [Document] {
    if let predicate {
      return joinedDocuments.values.map(\.model).filter(predicate)
    } else {
      return joinedDocuments.values.map(\.model)
    }
  }

  public func load() async throws {
    async let friends = Friend.query().all()
    async let documents = Document.query().all()
    async let editions = Edition.query().all()
    async let impressions = EditionImpression.query().all()
    async let isbns = Isbn.query().all()
    let documentsMap = try await documents.map

    joinedFriends = try await friends.reduce(into: [:]) { joined, friend in
      joined[friend.id] = JoinedFriend(model: friend)
    }

    joinedDocuments = try await documents.reduce(into: [:]) { joined, document in
      let joinedDocument = JoinedDocument(
        model: document,
        altLanguage: document.altLanguageId.flatMap { documentsMap[$0] },
        friend: joinedFriends[document.friendId]!
      )
      joined[document.id] = joinedDocument
      joinedFriends[document.friendId]!.documents.append(joinedDocument)
    }

    joinedEditions = try await editions.reduce(into: [:]) { joined, edition in
      let joinedEdition = JoinedEdition(
        model: edition,
        document: joinedDocuments[edition.documentId]!
      )
      joined[edition.id] = joinedEdition
      joinedDocuments[edition.documentId]!.editions.append(joinedEdition)
    }

    joinedImpressions = try await impressions.reduce(into: [:]) { joined, impression in
      let joinedImpression = JoinedEditionImpression(
        model: impression,
        edition: joinedEditions[impression.editionId]!
      )
      joined[impression.id] = joinedImpression
      joinedEditions[impression.editionId]!.impression = joinedImpression
    }

    joinedIsbns = try await isbns.reduce(into: [:]) { joined, isbn in
      let joinedIsbn = JoinedIsbn(
        model: isbn
        // , edition: isbn.editionId.flatMap { joinedEditions[$0] }
      )
      joined[isbn.id] = joinedIsbn
      if let editionId = isbn.editionId, joinedEditions[editionId] != nil {
        joined[isbn.id]!.edition = joinedEditions[editionId]
        joinedEditions[editionId]!.isbn = joinedIsbn
      }
    }
  }

  // func friends() throws -> some Collection<JoinedFriend> {
  //   joinedFriends.values
  // }

  func documents() throws -> some Collection<JoinedDocument> {
    joinedDocuments.values
  }
}

extension Array where Element: ApiModel {
  var map: [Element.IdValue: Element] {
    reduce(into: [:]) { map, element in
      map[element.id] = element
    }
  }
}

@dynamicMemberLookup
@propertyWrapper
enum Boxed<T> {
  indirect case wrapped(T)

  var wrappedValue: T {
    get { switch self { case .wrapped(let x): return x } }
    set { self = .wrapped(newValue) }
  }

  init(wrappedValue: T) {
    self = .wrapped(wrappedValue)
  }

  subscript<U>(dynamicMember keyPath: KeyPath<T, U>) -> U {
    wrappedValue[keyPath: keyPath]
  }
}

extension Boxed: Codable where T: Codable {}
extension Boxed: Sendable where T: Sendable {}
