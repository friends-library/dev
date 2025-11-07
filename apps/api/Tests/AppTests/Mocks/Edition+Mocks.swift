@testable import App

extension Edition {
  static var mock: Edition {
    Edition(documentId: .init(), type: .updated, editor: nil)
  }

  static var empty: Edition {
    Edition(documentId: .init(), type: .updated, editor: nil)
  }

  static var random: Edition {
    Edition(
      documentId: .init(),
      type: EditionType.allCases.shuffled().first!,
      editor: Bool.random() ? "@random".random : nil,
    )
  }
}
