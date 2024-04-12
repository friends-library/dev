import Vapor

extension LegacyRest {

  static func appAudios(lang: Lang) async throws -> Response {
    let data: Data
    if let cachedData = await cachedData.getLegacyAppAudios(lang: lang) {
      data = cachedData
    } else {
      data = try await queryData(lang: lang)
      await cachedData.setLegacyAppAudios(data: data, lang: lang)
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
    // let friends: [Friend] = try await Current.db.query(Friend.self)
    //   .all()
    //   .filter { $0.lang == lang }

    // let documents: [Document] = try friends
    //   .flatMap { try $0.documents.models }
    //   .filter(\.hasNonDraftEdition)

    // let editions: [Edition] = try documents
    //   .flatMap { try $0.editions.models }
    //   .filter { try $0.impression.model != nil && !$0.isDraft }

    // let audios: [AppAudio] = try editions
    //   .compactMap { try $0.audio.model }
    //   .filter(\.isPublished)
    //   .map(toAppAudio)

    // return try JSONEncoder().encode(audios)
  }
}

private struct AppAudio: Codable {
  struct Part: Codable {
    let audioId: String
    let index: Int
    let title: String
    let duration: Double
    let size: Int
    let sizeLq: Int
    let url: String
    let urlLq: String
  }

  let id: String
  let date: String
  let title: String
  let friend: String
  let friendSort: String
  let reader: String
  let artwork: String
  let description: String
  let shortDescription: String
  let parts: [Part]
}

private func toAppAudio(_ audio: Audio) -> AppAudio {
  let edition = audio.edition.require()
  let document = edition.document.require()
  let friend = document.friend.require()
  let parts = audio.parts.require()
  return .init(
    id: "\(document.id.lowercased)--\(edition.type)",
    date: audio.createdAt.isoString,
    title: document.title,
    friend: friend.name,
    friendSort: friend.alphabeticalName,
    reader: audio.reader,
    artwork: edition.images.square.w1400.url.absoluteString,
    description: document.description,
    shortDescription: document.partialDescription,
    parts: parts
      .sorted { $0.order < $1.order }
      .filter(\.isPublished)
      .enumerated()
      .map { index, part in .init(
        audioId: "\(document.id.lowercased)--\(edition.type)",
        index: index,
        title: part.title,
        duration: part.duration.rawValue,
        size: part.mp3SizeHq.rawValue,
        sizeLq: part.mp3SizeLq.rawValue,
        url: part.mp3File.hq.sourceUrl.absoluteString,
        urlLq: part.mp3File.lq.sourceUrl.absoluteString
      ) }
  )
}
