@testable import App

extension FreeOrderRequest {
  static var mock: FreeOrderRequest {
    FreeOrderRequest(
      name: "@mock name",
      email: "mock@mock.com",
      requestedBooks: "@mock requestedBooks",
      aboutRequester: "@mock aboutRequester",
      addressStreet: "@mock addressStreet",
      addressStreet2: nil,
      addressCity: "@mock addressCity",
      addressState: "@mock addressState",
      addressZip: "@mock addressZip",
      addressCountry: "@mock addressCountry",
      source: "@mock source",
    )
  }

  static var empty: FreeOrderRequest {
    FreeOrderRequest(
      name: "",
      email: "",
      requestedBooks: "",
      aboutRequester: "",
      addressStreet: "",
      addressStreet2: nil,
      addressCity: "",
      addressState: "",
      addressZip: "",
      addressCountry: "",
      source: "",
    )
  }

  static var random: FreeOrderRequest {
    FreeOrderRequest(
      name: "@random".random,
      email: .init(rawValue: "@random".random),
      requestedBooks: "@random".random,
      aboutRequester: "@random".random,
      addressStreet: "@random".random,
      addressStreet2: Bool.random() ? "@random".random : nil,
      addressCity: "@random".random,
      addressState: "@random".random,
      addressZip: "@random".random,
      addressCountry: "@random".random,
      source: "@random".random,
    )
  }
}
