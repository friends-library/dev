// auto-generated, do not edit
import Graphiti
import Vapor

extension AppSchema {
  static var AudioType: ModelType<Audio> {
    Type(Audio.self) {
      Field("id", at: \.id.rawValue.lowercased)
      Field("editionId", at: \.editionId.rawValue.lowercased)
      Field("reader", at: \.reader)
      Field("isIncomplete", at: \.isIncomplete)
      Field("mp3ZipSizeHq", at: \.mp3ZipSizeHq.rawValue)
      Field("mp3ZipSizeLq", at: \.mp3ZipSizeLq.rawValue)
      Field("m4bSizeHq", at: \.m4bSizeHq.rawValue)
      Field("m4bSizeLq", at: \.m4bSizeLq.rawValue)
      Field("externalPlaylistIdHq", at: \.externalPlaylistIdHq?.rawValue)
      Field("externalPlaylistIdLq", at: \.externalPlaylistIdLq?.rawValue)
      Field("createdAt", at: \.createdAt)
      Field("updatedAt", at: \.updatedAt)
      Field("lang", at: \.lang)
      Field("humanDurationClock", at: \.humanDurationClock)
      Field("humanDurationAbbrev", at: \.humanDurationAbbrev)
      Field("isPublished", at: \.isPublished)
      Field("files", at: \.files)
      Field("isValid", at: \.isValid)
      Field("edition", with: \.edition)
      Field("parts", with: \.parts)
    }
  }

  struct CreateAudioInput: Codable {
    let id: UUID?
    let editionId: UUID
    let reader: String
    let isIncomplete: Bool?
    let mp3ZipSizeHq: Int
    let mp3ZipSizeLq: Int
    let m4bSizeHq: Int
    let m4bSizeLq: Int
    let externalPlaylistIdHq: Int64?
    let externalPlaylistIdLq: Int64?
  }

  struct UpdateAudioInput: Codable {
    let id: UUID
    let editionId: UUID
    let reader: String
    let isIncomplete: Bool
    let mp3ZipSizeHq: Int
    let mp3ZipSizeLq: Int
    let m4bSizeHq: Int
    let m4bSizeLq: Int
    let externalPlaylistIdHq: Int64?
    let externalPlaylistIdLq: Int64?
  }

  static var CreateAudioInputType: AppInput<CreateAudioInput> {
    Input(CreateAudioInput.self) {
      InputField("id", at: \.id)
      InputField("editionId", at: \.editionId)
      InputField("reader", at: \.reader)
      InputField("isIncomplete", at: \.isIncomplete)
      InputField("mp3ZipSizeHq", at: \.mp3ZipSizeHq)
      InputField("mp3ZipSizeLq", at: \.mp3ZipSizeLq)
      InputField("m4bSizeHq", at: \.m4bSizeHq)
      InputField("m4bSizeLq", at: \.m4bSizeLq)
      InputField("externalPlaylistIdHq", at: \.externalPlaylistIdHq)
      InputField("externalPlaylistIdLq", at: \.externalPlaylistIdLq)
    }
  }

  static var UpdateAudioInputType: AppInput<UpdateAudioInput> {
    Input(UpdateAudioInput.self) {
      InputField("id", at: \.id)
      InputField("editionId", at: \.editionId)
      InputField("reader", at: \.reader)
      InputField("isIncomplete", at: \.isIncomplete)
      InputField("mp3ZipSizeHq", at: \.mp3ZipSizeHq)
      InputField("mp3ZipSizeLq", at: \.mp3ZipSizeLq)
      InputField("m4bSizeHq", at: \.m4bSizeHq)
      InputField("m4bSizeLq", at: \.m4bSizeLq)
      InputField("externalPlaylistIdHq", at: \.externalPlaylistIdHq)
      InputField("externalPlaylistIdLq", at: \.externalPlaylistIdLq)
    }
  }

  static var getAudio: AppField<Audio, IdentifyEntityArgs> {
    Field("getAudio", at: Resolver.getAudio) {
      Argument("id", at: \.id)
    }
  }

  static var getAudios: AppField<[Audio], NoArgs> {
    Field("getAudios", at: Resolver.getAudios)
  }

  static var createAudio: AppField<Audio, InputArgs<CreateAudioInput>> {
    Field("createAudio", at: Resolver.createAudio) {
      Argument("input", at: \.input)
    }
  }

  static var createAudios: AppField<[Audio], InputArgs<[CreateAudioInput]>> {
    Field("createAudios", at: Resolver.createAudios) {
      Argument("input", at: \.input)
    }
  }

  static var updateAudio: AppField<Audio, InputArgs<UpdateAudioInput>> {
    Field("updateAudio", at: Resolver.updateAudio) {
      Argument("input", at: \.input)
    }
  }

  static var updateAudios: AppField<[Audio], InputArgs<[UpdateAudioInput]>> {
    Field("updateAudios", at: Resolver.updateAudios) {
      Argument("input", at: \.input)
    }
  }

  static var deleteAudio: AppField<Audio, IdentifyEntityArgs> {
    Field("deleteAudio", at: Resolver.deleteAudio) {
      Argument("id", at: \.id)
    }
  }
}

extension Audio {
  convenience init(_ input: AppSchema.CreateAudioInput) {
    self.init(
      editionId: .init(rawValue: input.editionId),
      reader: input.reader,
      mp3ZipSizeHq: .init(rawValue: input.mp3ZipSizeHq),
      mp3ZipSizeLq: .init(rawValue: input.mp3ZipSizeLq),
      m4bSizeHq: .init(rawValue: input.m4bSizeHq),
      m4bSizeLq: .init(rawValue: input.m4bSizeLq),
      externalPlaylistIdHq: input.externalPlaylistIdHq.map { .init(rawValue: $0) },
      externalPlaylistIdLq: input.externalPlaylistIdLq.map { .init(rawValue: $0) }
    )
    if let id = input.id {
      self.id = .init(rawValue: id)
    }
    if let isIncomplete = input.isIncomplete {
      self.isIncomplete = isIncomplete
    }
  }

  convenience init(_ input: AppSchema.UpdateAudioInput) {
    self.init(
      id: .init(rawValue: input.id),
      editionId: .init(rawValue: input.editionId),
      reader: input.reader,
      mp3ZipSizeHq: .init(rawValue: input.mp3ZipSizeHq),
      mp3ZipSizeLq: .init(rawValue: input.mp3ZipSizeLq),
      m4bSizeHq: .init(rawValue: input.m4bSizeHq),
      m4bSizeLq: .init(rawValue: input.m4bSizeLq),
      externalPlaylistIdHq: input.externalPlaylistIdHq.map { .init(rawValue: $0) },
      externalPlaylistIdLq: input.externalPlaylistIdLq.map { .init(rawValue: $0) },
      isIncomplete: input.isIncomplete
    )
  }

  func update(_ input: AppSchema.UpdateAudioInput) {
    editionId = .init(rawValue: input.editionId)
    reader = input.reader
    isIncomplete = input.isIncomplete
    mp3ZipSizeHq = .init(rawValue: input.mp3ZipSizeHq)
    mp3ZipSizeLq = .init(rawValue: input.mp3ZipSizeLq)
    m4bSizeHq = .init(rawValue: input.m4bSizeHq)
    m4bSizeLq = .init(rawValue: input.m4bSizeLq)
    externalPlaylistIdHq = input.externalPlaylistIdHq.map { .init(rawValue: $0) }
    externalPlaylistIdLq = input.externalPlaylistIdLq.map { .init(rawValue: $0) }
    updatedAt = Current.date()
  }
}
