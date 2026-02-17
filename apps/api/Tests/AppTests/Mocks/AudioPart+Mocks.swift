import NonEmpty

@testable import App

extension AudioPart {
  static var mock: AudioPart {
    AudioPart(
      id: .init(.init()),
      audioId: .init(.init()),
      title: "@mock title",
      duration: 42,
      chapters: NonEmpty<[Int]>(42),
      order: 42,
      mp3SizeHq: .init(rawValue: 42),
      mp3SizeLq: .init(rawValue: 42),
    )
  }

  static var empty: AudioPart {
    AudioPart(
      id: .init(.init()),
      audioId: .init(.init()),
      title: "",
      duration: 0,
      chapters: NonEmpty<[Int]>(0),
      order: 0,
      mp3SizeHq: .init(rawValue: 0),
      mp3SizeLq: .init(rawValue: 0),
    )
  }

  static var random: AudioPart {
    AudioPart(
      id: .init(.init()),
      audioId: .init(.init()),
      title: "@random".random,
      duration: .init(rawValue: Double.random(in: 100 ... 999)),
      chapters: NonEmpty<[Int]>(Int.random),
      order: Int.random,
      mp3SizeHq: .init(rawValue: Int.random),
      mp3SizeLq: .init(rawValue: Int.random),
    )
  }
}
