import Foundation

@testable import App

extension Friend {
  static var mock: Friend {
    Friend(
      id: .init(.init()),
      lang: .en,
      name: "@mock name",
      slug: "mock-slug",
      gender: .male,
      description: "@mock description",
      born: nil,
      died: nil,
      published: nil,
    )
  }

  static var empty: Friend {
    Friend(
      id: .init(.init()),
      lang: .en,
      name: "",
      slug: "",
      gender: .male,
      description: "",
      born: nil,
      died: nil,
      published: nil,
    )
  }

  static var random: Friend {
    Friend(
      id: .init(.init()),
      lang: Lang.allCases.shuffled().first!,
      name: "@random".random,
      slug: "random-slug-\(Int.random)",
      gender: Gender.allCases.shuffled().first!,
      description: "@random".random,
      born: Bool.random() ? Int.random : nil,
      died: Bool.random() ? Int.random : nil,
      published: Bool.random() ? Date() : nil,
    )
  }
}
