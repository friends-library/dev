import Dependencies

func with<Value>(dependency keyPath: KeyPath<DependencyValues, Value>) -> Value {
  @Dependency(keyPath) var value
  return value
}

func get<Value>(dependency keyPath: KeyPath<DependencyValues, Value>) -> Value {
  @Dependency(keyPath) var value
  return value
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
