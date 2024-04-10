import DuetSQL

final class Friend: Codable, Sendable {
  var id: Id
  var lang: Lang
  var name: String
  var slug: String
  var gender: Gender
  var description: String
  var born: Int?
  var died: Int?
  var published: Date?
  var createdAt = Current.date()
  var updatedAt = Current.date()
  var deletedAt: Date?

  var documents = Children<Document>.notLoaded
  var residences = Children<FriendResidence>.notLoaded
  var quotes = Children<FriendQuote>.notLoaded

  var isCompilations: Bool {
    slug.starts(with: "compila")
  }

  var directoryPath: String {
    "\(lang)/\(slug)"
  }

  var hasNonDraftDocument: Bool {
    documents.require().first { $0.hasNonDraftEdition } != nil
  }

  var relatedDocuments: [RelatedDocument] {
    documents.require().flatMap { $0.relatedDocuments.require() }
  }

  var alphabeticalName: String {
    let parts = name.split(separator: " ")
    guard parts.count > 1, let last = parts.last else { return name }
    return "\(last), \(parts.dropLast().joined(separator: " "))"
  }

  init(
    id: Id = .init(),
    lang: Lang,
    name: String,
    slug: String,
    gender: Gender,
    description: String,
    born: Int?,
    died: Int?,
    published: Date?
  ) {
    self.id = id
    self.lang = lang
    self.name = name
    self.slug = slug
    self.gender = gender
    self.description = description
    self.born = born
    self.died = died
    self.published = published
  }
}

// loaders

extension Friend {
  func documents() async throws -> [Document] {
    try await documents.useLoaded(or: {
      try await Document.query()
        .where(.friendId == id)
        .all()
    })
  }

  func residences() async throws -> [FriendResidence] {
    try await residences.useLoaded(or: {
      try await FriendResidence.query()
        .where(.friendId == id)
        .all()
    })
  }

  func quotes() async throws -> [FriendQuote] {
    try await quotes.useLoaded(or: {
      try await FriendQuote.query()
        .where(.friendId == id)
        .all()
    })
  }
}

// extensions

extension Friend {
  enum Gender: String, Codable, CaseIterable {
    case male
    case female
    case mixed
  }
}

extension Friend.Gender: PostgresEnum {
  var typeName: String { Friend.M11.GenderEnum.name }
}
