import DuetSQL

struct Friend: Codable, Sendable, Equatable {
  var id: Id
  var lang: Lang
  var name: String
  var slug: String
  var gender: Gender
  var description: String
  var born: Int?
  var died: Int?
  var published: Date?
  var outOfBand: Bool
  var createdAt = Current.date()
  var updatedAt = Current.date()
  var deletedAt: Date?

  var isCompilations: Bool {
    self.slug.starts(with: "compila")
  }

  var directoryPath: String {
    "\(self.lang)/\(self.slug)"
  }

  var alphabeticalName: String {
    let parts = self.name.split(separator: " ")
    guard parts.count > 1, let last = parts.last else { return self.name }
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
    published: Date?,
    outOfBand: Bool = false,
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
    self.outOfBand = outOfBand
  }
}

// extensions

extension Friend {
  struct DirectoryPathData {
    var lang: Lang
    var slug: String
  }

  var urlPath: String {
    switch (self.lang, self.gender) {
    case (_, .mixed):
      self.slug // compilations
    case (.en, _):
      "friend/\(self.slug)"
    case (.es, .male):
      "amigo/\(self.slug)"
    case (.es, .female):
      "amiga/\(self.slug)"
    }
  }
}

extension Friend.DirectoryPathData: DirectoryPathable {
  var directoryPath: String {
    "\(self.lang)/\(self.slug)"
  }
}

extension Friend.Joined {
  var hasNonDraftDocument: Bool {
    documents.first { $0.hasNonDraftEdition } != nil
  }

  var hasNonDraftNonOobDocument: Bool {
    !model.outOfBand && self.hasNonDraftDocument
  }

  var directoryPathData: Friend.DirectoryPathData {
    .init(lang: model.lang, slug: model.slug)
  }
}

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
