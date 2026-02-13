import DuetSQL

struct Document: Codable, Sendable, Equatable {
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
    Asciidoc.htmlTitle(self.title)
  }

  var htmlShortTitle: String {
    Asciidoc.htmlShortTitle(self.title)
  }

  var utf8ShortTitle: String {
    Asciidoc.utf8ShortTitle(self.title)
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
    featuredDescription: String?,
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
  struct DirectoryPathData: DirectoryPathable {
    var friend: Friend.DirectoryPathData
    var slug: String

    var directoryPath: String {
      "\(self.friend.directoryPath)/\(self.slug)"
    }
  }
}

extension Document.Joined {
  var hasNonDraftEdition: Bool {
    editions.contains { !$0.isDraft }
  }

  var primaryEdition: Edition.Joined? {
    let allEditions = editions.filter { $0.isDraft == false }
    return allEditions.first { $0.type == .updated } ??
      allEditions.first { $0.type == .modernized } ??
      allEditions.first
  }

  var directoryPathData: Document.DirectoryPathData {
    .init(friend: friend.directoryPathData, slug: model.slug)
  }

  var directoryPath: String {
    self.directoryPathData.directoryPath
  }

  var trimmedUtf8ShortTitle: String {
    Asciidoc.trimmedUtf8ShortDocumentTitle(model.title, lang: friend.lang)
  }
}
