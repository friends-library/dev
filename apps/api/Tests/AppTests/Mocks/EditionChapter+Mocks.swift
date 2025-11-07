@testable import App

extension EditionChapter {
  static var mock: EditionChapter {
    EditionChapter(
      editionId: .init(),
      order: 42,
      shortHeading: "@mock shortHeading",
      isIntermediateTitle: true,
    )
  }

  static var empty: EditionChapter {
    EditionChapter(editionId: .init(), order: 0, shortHeading: "", isIntermediateTitle: false)
  }

  static var random: EditionChapter {
    EditionChapter(
      editionId: .init(),
      order: Int.random,
      shortHeading: "@random".random,
      isIntermediateTitle: Bool.random(),
    )
  }
}
