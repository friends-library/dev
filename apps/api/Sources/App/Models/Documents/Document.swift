import DuetSQL

struct Document: Codable, Sendable {
  var id: Id
  var friendId: Friend.Id
  var altLanguageId: Id?
  var title: String
  var slug: String
  var filename: String
  var published: Int?
  var originalTitle: String?
  var incomplete: Bool // e.g. spanish books that are available before completely translated
  var description: String
  var partialDescription: String
  var featuredDescription: String?
  var createdAt = Current.date()
  var updatedAt = Current.date()
  var deletedAt: Date? = nil

  var htmlTitle: String {
    Asciidoc.htmlTitle(title)
  }

  var htmlShortTitle: String {
    Asciidoc.htmlShortTitle(title)
  }

  var utf8ShortTitle: String {
    Asciidoc.utf8ShortTitle(title)
  }

  init(
    id: Id = .init(),
    friendId: Friend.Id,
    altLanguageId: Id?,
    title: String,
    slug: String,
    filename: String,
    published: Int?,
    originalTitle: String?,
    incomplete: Bool,
    description: String,
    partialDescription: String,
    featuredDescription: String?
  ) {
    self.id = id
    self.friendId = friendId
    self.slug = slug
    self.altLanguageId = altLanguageId
    self.title = title
    self.filename = filename
    self.published = published
    self.originalTitle = originalTitle
    self.incomplete = incomplete
    self.description = description
    self.partialDescription = partialDescription
    self.featuredDescription = featuredDescription
  }
}

// extensions

extension Document {
  struct DirectoryPathData {
    var friend: Friend.DirectoryPathData
    var slug: String
  }
}

extension Document.DirectoryPathData: DirectoryPathable {
  var directoryPath: String {
    "\(friend.directoryPath)/\(slug)"
  }
}
