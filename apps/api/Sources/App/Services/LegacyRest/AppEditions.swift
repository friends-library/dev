import Vapor

extension LegacyRest {

  static func appEditions(lang: Lang) async throws -> Response {
    Current.logger.info("Serving app editions, lang=\(lang)")
    let data: Data
    if let cachedData = await cachedData.getLegacyAppEditions(lang: lang) {
      data = cachedData
    } else {
      data = try await queryData(lang: lang)
      await cachedData.setLegacyAppEditions(data: data, lang: lang)
    }
    let response = Response()
    response.status = .ok
    response.headers.add(name: .contentType, value: "application/json")
    response.headers.add(name: .contentLength, value: "\(data.count)")
    response.body = .init(data: data)
    return response
  }

  private static func queryData(lang: Lang) async throws -> Data {
    fatalError("mega query")
    // let editions = try await Current.db.query(Friend.self).all()
    //   .filter { $0.lang == lang }
    //   .flatMap { try $0.documents.models }
    //   .filter(\.hasNonDraftEdition)
    //   .flatMap { try $0.editions.models }
    //   .filter { try $0.impression.model != nil && !$0.isDraft }
    //   .map(toAppEdition)
    // return try JSONEncoder().encode(editions)
  }
}

private struct AppEdition: Codable {
  struct Document: Codable {
    let id: String
    let title: String
    let utf8ShortTitle: String
    let trimmedUtf8ShortTitle: String
    let description: String
    let shortDescription: String
  }

  struct Friend: Codable {
    let name: String
    let nameSort: String
    let isCompilations: Bool
  }

  struct Ebook: Codable {
    let loggedDownloadUrl: String
    let directDownloadUrl: String
    let numPages: Int
  }

  struct Audio: Codable {
    struct Part: Codable {
      let editionId: String
      let index: Int
      let title: String
      let utf8ShortTitle: String
      let duration: Double
      let size: Int
      let sizeLq: Int
      let url: String
      let urlLq: String
    }

    let reader: String
    let totalDuration: Double
    let publishedDate: String
    let parts: [Part]
  }

  struct Images: Codable {
    struct Image: Codable {
      let width: Int
      let height: Int
      let url: String
    }

    let square: [Image]
    let threeD: [Image]
  }

  struct Chapter: Codable {
    let index: Int
    let id: String
    let slug: String
    let shortHeading: String
    let isIntermediateTitle: Bool
    let isSequenced: Bool
    let hasNonSequenceTitle: Bool
    @EncodeNilAsNull var sequenceNumber: Int?
    @EncodeNilAsNull var nonSequenceTitle: String?
  }

  let id: String
  let lang: Lang
  let document: Document
  let revision: String
  let type: EditionType
  let publishedDate: String
  let friend: Friend
  let ebook: Ebook
  let isMostModernized: Bool
  @EncodeNilAsNull var audio: Audio?
  let images: Images
  let chapters: [Chapter]
}

private func toAppEdition(_ edition: Edition) -> AppEdition {
  let document = edition.document.require()
  let friend = document.friend.require()
  let impression = edition.impression.require()!
  let audio = edition.audio.require()
  return .init(
    id: "\(document.id.lowercased)--\(edition.type)",
    lang: friend.lang,
    document: .init(
      id: document.id.lowercased,
      title: document.title,
      utf8ShortTitle: document.utf8ShortTitle,
      trimmedUtf8ShortTitle: document.trimmedUtf8ShortTitle,
      description: document.description,
      shortDescription: document.partialDescription
    ),
    revision: impression.publishedRevision.rawValue,
    type: edition.type,
    publishedDate: impression.createdAt.isoString,
    friend: .init(
      name: friend.name,
      nameSort: friend.alphabeticalName,
      isCompilations: friend.isCompilations
    ),
    ebook: AppEdition.Ebook(
      loggedDownloadUrl: impression.files.ebook.app.logUrl.absoluteString,
      directDownloadUrl: impression.files.ebook.app.sourceUrl.absoluteString,
      numPages: impression.paperbackVolumes.reduce(0, +)
    ),
    isMostModernized: document.primaryEdition! == edition,
    audio: audio?.isPublished == true ? .init(
      reader: audio!.reader,
      totalDuration: audio!.parts.require().map(\.duration).reduce(0, +).rawValue,
      publishedDate: audio!.createdAt.isoString,
      parts: audio!.parts.require()
        .filter(\.isPublished)
        .sorted { $0.order < $1.order }
        .enumerated()
        .map { index, part in
          .init(
            editionId: "\(document.id.lowercased)--\(edition.type)",
            index: index,
            title: part.title,
            utf8ShortTitle: Asciidoc.utf8ShortTitle(part.title),
            duration: part.duration.rawValue,
            size: part.mp3SizeHq.rawValue,
            sizeLq: part.mp3SizeLq.rawValue,
            url: part.mp3File.hq.sourceUrl.absoluteString,
            urlLq: part.mp3File.lq.sourceUrl.absoluteString
          )
        }
    ) : nil,
    images: AppEdition.Images(
      square: edition.images.square.all
        .map { .init(width: $0.width, height: $0.height, url: $0.url.absoluteString) },
      threeD: edition.images.threeD.all
        .map { .init(width: $0.width, height: $0.height, url: $0.url.absoluteString) }
    ),
    chapters: edition.chapters.require().sorted { $0.order < $1.order }.enumerated()
      .map { index, chapter in .init(
        index: index,
        id: chapter.htmlId,
        slug: chapter.slug,
        shortHeading: Asciidoc.utf8ShortTitle(chapter.shortHeading),
        isIntermediateTitle: chapter.isIntermediateTitle,
        isSequenced: chapter.isSequenced,
        hasNonSequenceTitle: chapter.hasNonSequenceTitle,
        sequenceNumber: chapter.sequenceNumber,
        nonSequenceTitle: chapter.nonSequenceTitle
      ) }
  )
}

@propertyWrapper
struct EncodeNilAsNull<T>: Codable where T: Codable {
  var wrappedValue: T?

  init(wrappedValue: T?) {
    self.wrappedValue = wrappedValue
  }

  func encode(to encoder: Encoder) throws {
    var container = encoder.singleValueContainer()
    switch wrappedValue {
    case .some(let value): try container.encode(value)
    case .none: try container.encodeNil()
    }
  }
}
