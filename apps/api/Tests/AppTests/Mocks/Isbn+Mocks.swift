@testable import App

extension Isbn {
  static var mock: Isbn {
    Isbn(code: .init(rawValue: "@mock code"), editionId: nil)
  }

  static var empty: Isbn {
    Isbn(code: .init(rawValue: ""), editionId: nil)
  }

  static var random: Isbn {
    Isbn(
      code: .init(rawValue: "@random".random),
      editionId: nil,
    )
  }
}
