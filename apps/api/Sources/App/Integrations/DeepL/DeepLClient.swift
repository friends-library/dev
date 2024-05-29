import Foundation
import XHttp

enum DeepL {
  struct Client: Sendable {
    var translate: @Sendable (String, String?) async throws -> String
  }
}

extension DeepL.Client {
  static let live: Self = .init(translate: translate(text:with:))
  static let mock: Self = .init(translate: { text, _ in "¡\(text)!" })
}

// implementation

@Sendable private func translate(
  text: String,
  with context: String?
) async throws -> String {
  print(Env.DEEPL_API_KEY)
  let response = try await HTTP.postJson(
    TranslateRequest(text: [text], context: context, sourceLang: "EN", targetLang: "ES"),
    to: "https://api-free.deepl.com/v2/translate",
    decoding: TranslateResponse.self,
    headers: ["Authorization": "DeepL-Auth-Key \(Env.DEEPL_API_KEY)"],
    keyEncodingStrategy: .convertToSnakeCase
  )
  guard let text = response.translations.first?.text else {
    struct MissingTranslationText: Error {}
    throw MissingTranslationText()
  }
  return text
}

private struct TranslateRequest: Encodable, Equatable, Sendable {
  var text: [String]
  var context: String?
  var sourceLang: String?
  var targetLang: String
}

private struct TranslateResponse: Decodable, Equatable, Sendable {
  struct Translation: Decodable, Equatable, Sendable {
    var text: String
  }

  var translations: [Translation]
}
