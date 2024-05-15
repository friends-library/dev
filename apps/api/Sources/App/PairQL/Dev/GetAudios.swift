import PairQL

struct GetAudios: Pair {
  static let auth: Scope = .queryEntities

  struct AudioPart: PairNestable {
    var id: App.AudioPart.Id
    var chapters: [Int]
    var durationInSeconds: Double
    var title: String
    var order: Int
    var mp3SizeHq: Int
    var mp3SizeLq: Int
  }

  struct Edition: PairNestable {
    var id: App.Edition.Id
    var path: String
    var type: EditionType
    var coverImagePath: String
  }

  struct Document: PairNestable {
    var filename: String
    var title: String
    var slug: String
    var description: String
    var path: String
    var tags: [DocumentTag.TagType]
  }

  struct Friend: PairNestable {
    var lang: Lang
    var name: String
    var slug: String
    var alphabeticalName: String
    var isCompilations: Bool
  }

  struct Audio: PairOutput {
    var id: App.Audio.Id
    var isIncomplete: Bool
    var m4bSizeHq: Int
    var m4bSizeLq: Int
    var mp3ZipSizeHq: Int
    var mp3ZipSizeLq: Int
    var reader: String
    var parts: [AudioPart]
    var edition: Edition
    var document: Document
    var friend: Friend
  }

  typealias Output = [Audio]
}

extension GetAudios: NoInputResolver {
  static func resolve(in context: AuthedContext) async throws -> Output {
    try context.verify(Self.auth)
    let audios = try await App.Audio.Joined.all()
    return audios.map { audio in
      .init(
        id: audio.id,
        isIncomplete: audio.isIncomplete,
        m4bSizeHq: audio.m4bSizeHq.rawValue,
        m4bSizeLq: audio.m4bSizeLq.rawValue,
        mp3ZipSizeHq: audio.mp3ZipSizeHq.rawValue,
        mp3ZipSizeLq: audio.mp3ZipSizeLq.rawValue,
        reader: audio.reader,
        parts: audio.parts.map { part in
          .init(
            id: part.id,
            chapters: Array(part.chapters),
            durationInSeconds: part.duration.rawValue,
            title: part.title,
            order: part.order,
            mp3SizeHq: part.mp3SizeHq.rawValue,
            mp3SizeLq: part.mp3SizeLq.rawValue
          )
        },
        edition: .init(
          id: audio.edition.id,
          path: audio.edition.directoryPath,
          type: audio.edition.type,
          coverImagePath: audio.edition.images.square.w1400.path
        ),
        document: .init(
          filename: audio.edition.document.filename,
          title: audio.edition.document.title,
          slug: audio.edition.document.slug,
          description: audio.edition.document.description,
          path: audio.edition.document.directoryPath,
          tags: audio.edition.document.tags
        ),
        friend: .init(
          lang: audio.edition.document.friend.lang,
          name: audio.edition.document.friend.name,
          slug: audio.edition.document.friend.slug,
          alphabeticalName: audio.edition.document.friend.alphabeticalName,
          isCompilations: audio.edition.document.friend.isCompilations
        )
      )
    }
  }
}
