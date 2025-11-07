@testable import App

extension Audio {
  static var mock: Audio {
    Audio(
      editionId: .init(),
      reader: "@mock reader",
      mp3ZipSizeHq: .init(rawValue: 42),
      mp3ZipSizeLq: .init(rawValue: 42),
      m4bSizeHq: .init(rawValue: 42),
      m4bSizeLq: .init(rawValue: 42),
    )
  }

  static var empty: Audio {
    Audio(
      editionId: .init(),
      reader: "",
      mp3ZipSizeHq: .init(rawValue: 0),
      mp3ZipSizeLq: .init(rawValue: 0),
      m4bSizeHq: .init(rawValue: 0),
      m4bSizeLq: .init(rawValue: 0),
    )
  }

  static var random: Audio {
    Audio(
      editionId: .init(),
      reader: "@random".random,
      mp3ZipSizeHq: .init(rawValue: Int.random),
      mp3ZipSizeLq: .init(rawValue: Int.random),
      m4bSizeHq: .init(rawValue: Int.random),
      m4bSizeLq: .init(rawValue: Int.random),
    )
  }
}
