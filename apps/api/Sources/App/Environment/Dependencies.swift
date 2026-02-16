import Dependencies

func with<Value>(dependency keyPath: KeyPath<DependencyValues, Value>) -> Value {
  @Dependency(keyPath) var value
  return value
}

func get<Value>(dependency keyPath: KeyPath<DependencyValues, Value>) -> Value {
  @Dependency(keyPath) var value
  return value
}
