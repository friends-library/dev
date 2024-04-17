import PairQL

struct GetAudios: Pair {
  static var auth: Scope = .queryEntities

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
    fatalError("mega query")
    // let audios = try await App.Audio.query().all()
    // return try await audios.concurrentMap { audio in
    //   var audio = audio
    //   let parts = try await audio.parts()
    //   var edition = try await audio.edition()
    //   var document = try await edition.document()
    //   let friend = try await document.friend()
    //   return .init(
    //     id: audio.id,
    //     isIncomplete: audio.isIncomplete,
    //     m4bSizeHq: audio.m4bSizeHq.rawValue,
    //     m4bSizeLq: audio.m4bSizeLq.rawValue,
    //     mp3ZipSizeHq: audio.mp3ZipSizeHq.rawValue,
    //     mp3ZipSizeLq: audio.mp3ZipSizeLq.rawValue,
    //     reader: audio.reader,
    //     parts: parts.map { part in
    //       .init(
    //         id: part.id,
    //         chapters: Array(part.chapters),
    //         durationInSeconds: part.duration.rawValue,
    //         title: part.title,
    //         order: part.order,
    //         mp3SizeHq: part.mp3SizeHq.rawValue,
    //         mp3SizeLq: part.mp3SizeLq.rawValue
    //       )
    //     },
    //     edition: .init(
    //       id: edition.id,
    //       path: edition.directoryPath,
    //       type: edition.type,
    //       coverImagePath: edition.images.square.w1400.path
    //     ),
    //     document: .init(
    //       filename: document.filename,
    //       title: document.title,
    //       slug: document.slug,
    //       description: document.description,
    //       path: document.directoryPath,
    //       tags: []
    //     ),
    //     friend: .init(
    //       lang: friend.lang,
    //       name: friend.name,
    //       slug: friend.slug,
    //       alphabeticalName: friend.alphabeticalName,
    //       isCompilations: friend.isCompilations
    //     )
    //   )
    // }
  }
}
