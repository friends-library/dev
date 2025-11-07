import Foundation

enum JSON {
  enum Format {
    case pretty
    case compact
  }

  static func encode(_ value: some Encodable, _ format: Format = .compact) -> String? {
    let encoder = JSONEncoder()
    encoder.outputFormatting = format == .pretty ? .prettyPrinted : []
    encoder.outputFormatting.insert(.sortedKeys)
    let data = try? encoder.encode(value)
    return data.flatMap { String(data: $0, encoding: .utf8) }
  }

  static func decode<T: Decodable>(
    _: T.Type,
    from data: Data,
    keyDecodingStrategy: JSONDecoder.KeyDecodingStrategy = .useDefaultKeys,
  ) -> T? {
    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = keyDecodingStrategy
    return try? decoder.decode(T.self, from: data)
  }
}
