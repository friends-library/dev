// auto-generated, do not edit
import DuetMock
import Foundation
import GraphQL

@testable import App

extension Friend {
  static var mock: Friend {
    Friend(
      lang: .en,
      name: "@mock name",
      slug: "mock-slug",
      gender: .male,
      description: "@mock description",
      born: nil,
      died: nil,
      published: nil
    )
  }

  static var empty: Friend {
    Friend(
      lang: .en,
      name: "",
      slug: "",
      gender: .male,
      description: "",
      born: nil,
      died: nil,
      published: nil
    )
  }

  static var random: Friend {
    Friend(
      lang: Lang.allCases.shuffled().first!,
      name: "@random".random,
      slug: "random-slug-\(Int.random)",
      gender: Gender.allCases.shuffled().first!,
      description: "@random".random,
      born: Bool.random() ? Int.random : nil,
      died: Bool.random() ? Int.random : nil,
      published: Bool.random() ? Date() : nil
    )
  }

  func gqlMap(omitting: Set<String> = []) -> GraphQL.Map {
    var map: GraphQL.Map = .dictionary([
      "id": .string(id.lowercased),
      "lang": .string(lang.rawValue),
      "name": .string(name),
      "slug": .string(slug),
      "gender": .string(gender.rawValue),
      "description": .string(description),
      "born": born != nil ? .number(Number(born!)) : .null,
      "died": died != nil ? .number(Number(died!)) : .null,
      "published": published != nil ? .string(published!.isoString) : .null,
    ])
    omitting.forEach { try? map.remove($0) }
    return map
  }
}
