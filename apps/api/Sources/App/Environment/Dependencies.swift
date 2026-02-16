import Dependencies

func with<Value>(dependency keyPath: KeyPath<DependencyValues, Value>) -> Value {
  @Dependency(keyPath) var value
  return value
}

func get<Value>(dependency keyPath: KeyPath<DependencyValues, Value>) -> Value {
  @Dependency(keyPath) var value
  return value
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
