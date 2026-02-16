import Dependencies
import Logging
import XPostmark
import XStripe

func with<Value>(dependency keyPath: KeyPath<DependencyValues, Value>) -> Value {
  @Dependency(keyPath) var value
  return value
}

func get<Value>(dependency keyPath: KeyPath<DependencyValues, Value>) -> Value {
  @Dependency(keyPath) var value
  return value
}

private enum LoggerKey: DependencyKey {
  static let liveValue = Logger(label: "api.friendslibrary")
  static let testValue = Logger.null
}

extension DependencyValues {
  var logger: Logger {
    get { self[LoggerKey.self] }
    set { self[LoggerKey.self] = newValue }
  }
}

private enum PostmarkClientKey: DependencyKey {
  static let liveValue: XPostmark.Client.SlackErrorLogging = .live
  static let testValue: XPostmark.Client.SlackErrorLogging = .mock
}

extension DependencyValues {
  var postmarkClient: XPostmark.Client.SlackErrorLogging {
    get { self[PostmarkClientKey.self] }
    set { self[PostmarkClientKey.self] = newValue }
  }
}

private enum SlackClientKey: DependencyKey {
  static let liveValue: RateLimitedSlackClient = .init(send: FlpSlack.Client().send)
  static let testValue: RateLimitedSlackClient = .init { _ in }
}

extension DependencyValues {
  var slackClient: RateLimitedSlackClient {
    get { self[SlackClientKey.self] }
    set { self[SlackClientKey.self] = newValue }
  }
}

private enum LuluClientKey: DependencyKey {
  static let liveValue: Lulu.Api.Client = .live
  static let testValue: Lulu.Api.Client = .mock
}

extension DependencyValues {
  var luluClient: Lulu.Api.Client {
    get { self[LuluClientKey.self] }
    set { self[LuluClientKey.self] = newValue }
  }
}

private enum StripeClientKey: DependencyKey {
  static let liveValue: Stripe.Client = .live
  static let testValue: Stripe.Client = .mock
}

extension DependencyValues {
  var stripe: Stripe.Client {
    get { self[StripeClientKey.self] }
    set { self[StripeClientKey.self] = newValue }
  }
}

private enum CloudflareClientKey: DependencyKey {
  static let liveValue: CloudflareClient = .live
  static let testValue: CloudflareClient = .test
}

extension DependencyValues {
  var cloudflareClient: CloudflareClient {
    get { self[CloudflareClientKey.self] }
    set { self[CloudflareClientKey.self] = newValue }
  }
}

private enum DeepLClientKey: DependencyKey {
  static let liveValue: DeepL.Client = .live
  static let testValue: DeepL.Client = .mock
}

extension DependencyValues {
  var deeplClient: DeepL.Client {
    get { self[DeepLClientKey.self] }
    set { self[DeepLClientKey.self] = newValue }
  }
}

private enum IpApiClientKey: DependencyKey {
  static let liveValue: IpApi.Client = .init()
  static let testValue: IpApi.Client = .mock
}

extension DependencyValues {
  var ipApiClient: IpApi.Client {
    get { self[IpApiClientKey.self] }
    set { self[IpApiClientKey.self] = newValue }
  }
}

private enum UserAgentParserKey: DependencyKey {
  static let liveValue: UserAgentParser = .live
  static let testValue: UserAgentParser = .mock
}

extension DependencyValues {
  var userAgentParser: UserAgentParser {
    get { self[UserAgentParserKey.self] }
    set { self[UserAgentParserKey.self] = newValue }
  }
}

private enum RandomNumberGeneratorKey: DependencyKey {
  static let liveValue: @Sendable () -> any RandomNumberGenerator = {
    SystemRandomNumberGenerator()
  }

  static let testValue: @Sendable () -> any RandomNumberGenerator = {
    SystemRandomNumberGenerator()
  }
}

extension DependencyValues {
  var randomNumberGenerator: @Sendable () -> any RandomNumberGenerator {
    get { self[RandomNumberGeneratorKey.self] }
    set { self[RandomNumberGeneratorKey.self] = newValue }
  }
}
