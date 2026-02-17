@testable import App

extension EditionChapter {
  static var mock: EditionChapter {
    EditionChapter(
      id: .init(.init()),
      editionId: .init(.init()),
      order: 42,
      shortHeading: "@mock shortHeading",
      isIntermediateTitle: true,
    )
  }

  static var empty: EditionChapter {
    EditionChapter(
      id: .init(.init()),
      editionId: .init(.init()),
      order: 0,
      shortHeading: "",
      isIntermediateTitle: false,
    )
  }

  static var random: EditionChapter {
    EditionChapter(
      id: .init(.init()),
      editionId: .init(.init()),
      order: Int.random,
      shortHeading: "@random".random,
      isIntermediateTitle: Bool.random(),
    )
  }
}
