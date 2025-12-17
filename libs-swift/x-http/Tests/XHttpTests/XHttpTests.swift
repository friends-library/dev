import Testing

@testable import XHttp

@Suite struct XHttpTests {
  @Test func `get decoding`() async throws {
    struct XkcdComic: Decodable, Equatable {
      let num: Int
      let title: String
      let month: String
      let year: String
    }

    let bobbyTables = try await HTTP.get(
      "https://xkcd.com/327/info.0.json",
      decoding: XkcdComic.self,
    )

    #expect(
      bobbyTables
        == XkcdComic(num: 327, title: "Exploits of a Mom", month: "10", year: "2007"),
    )
  }
}
