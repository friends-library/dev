@testable import App

extension App.Document {
  static var mock: App.Document {
    Document(
      friendId: .init(),
      altLanguageId: nil,
      title: "@mock title",
      slug: "mock-slug",
      filename: "mock-filename",
      published: nil,
      originalTitle: nil,
      incomplete: true,
      description: "@mock description",
      partialDescription: "@mock partialDescription",
      featuredDescription: nil,
    )
  }

  static var empty: App.Document {
    Document(
      friendId: .init(),
      altLanguageId: nil,
      title: "",
      slug: "",
      filename: "",
      published: nil,
      originalTitle: nil,
      incomplete: false,
      description: "",
      partialDescription: "",
      featuredDescription: nil,
    )
  }

  static var random: App.Document {
    Document(
      friendId: .init(),
      altLanguageId: Bool.random() ? .init(rawValue: .init()) : nil,
      title: "@random".random,
      slug: "random-slug-\(Int.random)",
      filename: "random-filename-\(Int.random)",
      published: Bool.random() ? Int.random : nil,
      originalTitle: Bool.random() ? "@random".random : nil,
      incomplete: Bool.random(),
      description: "@random".random,
      partialDescription: "@random".random,
      featuredDescription: Bool.random() ? "@random".random : nil,
    )
  }
}
