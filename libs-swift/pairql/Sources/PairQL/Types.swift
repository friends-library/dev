import Foundation

@_exported import CasePaths
@_exported import URLRouting

#if os(Linux)
  extension JSONEncoder: @unchecked Sendable {}
  extension JSONDecoder.DateDecodingStrategy: @unchecked Sendable {}
  extension ISO8601DateFormatter: @unchecked Sendable {}
#endif

public protocol PairRoute: Equatable {}

public typealias PairNestable = Codable & Equatable & Sendable

public protocol PairInput: Codable, Equatable {}

public protocol PairOutput: Codable, Equatable, Sendable {
  func jsonData() throws -> Data
}

public protocol Pair {
  static var name: String { get }
  static var auth: Auth { get }
  associatedtype Auth: Codable & Equatable & Sendable = NoAuth
  associatedtype Input: PairInput = NoInput
  associatedtype Output: PairOutput = Infallible
}

public extension Pair {
  static var name: String { "\(Self.self)" }
}

public extension Pair where Auth == NoAuth {
  static var auth: Auth { .init() }
}

public struct PairJsonEncodingError: Error {}

private let encoder = { () -> JSONEncoder in
  let encoder = JSONEncoder()
  encoder.dateEncodingStrategy = .iso8601
  return encoder
}()

public extension PairOutput {
  func jsonData() throws -> Data {
    try encoder.encode(self)
  }

  func json() throws -> String {
    guard let json = String(data: try jsonData(), encoding: .utf8) else {
      throw PairJsonEncodingError()
    }
    return json
  }
}

extension Array: PairOutput where Element: PairOutput {}
extension Array: PairInput where Element: PairInput {}
extension Dictionary: PairOutput where Key == String, Value: PairOutput {}
extension Dictionary: PairInput where Key == String, Value: PairInput {}

public struct NoInput: PairInput {
  public init() {}
}

public struct NoAuth: Equatable, Codable, Sendable {
  public init() {}
}

public struct Infallible: PairOutput {
  private init() {}
  public static var success: Self { .init() }
}

public struct SuccessOutput: PairOutput {
  public let success: Bool

  public init(_ success: Bool) {
    self.success = success
  }

  public init() {
    success = true
  }

  public static var success: Self { .init(true) }
  public static var failure: Self { .init(false) }
}

extension String: PairOutput {}
extension String: PairInput {}
extension UUID: PairInput {}

public protocol Resolver: Pair {
  associatedtype Context
  static func resolve(with input: Input, in context: Context) async throws -> Output
}

public protocol NoInputResolver: Pair where Input == NoInput {
  associatedtype Context
  static func resolve(in context: Context) async throws -> Output
}

public protocol RouteResponder {
  associatedtype RouteContext
  associatedtype RouteResponse
  static func respond(to route: Self, in context: RouteContext) async throws -> RouteResponse
}

extension Resolver {
  static func result(with input: Input, in context: Context) async -> Result<Output, Error> {
    do {
      return .success(try await resolve(with: input, in: context))
    } catch {
      return .failure(error)
    }
  }
}

public struct Operation<P: Pair>: ParserPrinter {
  private var pair: P.Type

  public init(_ pair: P.Type) {
    self.pair = pair
  }

  public func parse(_ input: inout URLRequestData) throws {
    try Path { pair.name }.parse(&input)
  }

  public func print(_ output: Void, into input: inout URLRequestData) throws {
    try Path { pair.name }.print(output, into: &input)
  }
}

public extension Conversion {
  static func input<P: Pair>(
    _ Pair: P.Type,
    dateDecodingStrategy strategy: JSONDecoder.DateDecodingStrategy? = .forgivingIso8601
  ) -> Self where Self == Conversions.JSON<P.Input> {
    if let strategy {
      let decoder = JSONDecoder()
      decoder.dateDecodingStrategy = strategy
      return .init(Pair.Input, decoder: decoder)
    }
    return .init(Pair.Input)
  }
}

public extension JSONDecoder.DateDecodingStrategy {
  static let forgivingIso8601 = custom {
    let container = try $0.singleValueContainer()
    let string = try container.decode(String.self)
    if let date = Formatter.iso8601withFractionalSeconds.date(from: string) ?? Formatter.iso8601
      .date(from: string) {
      return date
    }
    throw DecodingError.dataCorruptedError(
      in: container,
      debugDescription: "Invalid date: \(string)"
    )
  }
}

public extension Formatter {
  static let iso8601withFractionalSeconds: ISO8601DateFormatter = {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    return formatter
  }()

  static let iso8601: ISO8601DateFormatter = {
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime]
    return formatter
  }()
}
