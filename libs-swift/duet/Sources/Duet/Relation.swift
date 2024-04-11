public enum RelationError: Error {
  case notLoaded
}

public enum Siblings<C: Duet.Identifiable> {
  case notLoaded
  indirect case loaded([C])

  public var isLoaded: Bool {
    guard case .loaded = self else { return false }
    return true
  }

  public var models: [C] {
    get throws {
      guard case .loaded(let loaded) = self else {
        throw RelationError.notLoaded
      }
      return loaded
    }
  }

  public mutating func useLoaded(or load: () async throws -> [C]) async throws -> [C] {
    guard case .loaded(let loaded) = self else {
      let models = try await load()
      self = .loaded(models)
      return models
    }
    return loaded
  }
}

public enum Children<C: Duet.Identifiable> {
  case notLoaded
  indirect case loaded([C])

  public var isLoaded: Bool {
    guard case .loaded = self else { return false }
    return true
  }

  public var models: [C] {
    get throws {
      guard case .loaded(let loaded) = self else {
        throw RelationError.notLoaded
      }
      return loaded
    }
  }

  public mutating func useLoaded(or load: () async throws -> [C]) async throws -> [C] {
    guard case .loaded(let loaded) = self else {
      let models = try await load()
      self = .loaded(models)
      return models
    }
    return loaded
  }
}

public enum Parent<P: Duet.Identifiable> {
  case notLoaded
  indirect case loaded(P)

  public var isLoaded: Bool {
    guard case .loaded = self else { return false }
    return true
  }

  public var model: P {
    get throws {
      guard case .loaded(let loaded) = self else {
        throw RelationError.notLoaded
      }
      return loaded
    }
  }

  public mutating func useLoaded(or load: () async throws -> P) async throws -> P {
    guard case .loaded(let loaded) = self else {
      let model = try await load()
      self = .loaded(model)
      return model
    }
    return loaded
  }
}

public enum OptionalParent<P: Duet.Identifiable> {
  case notLoaded
  indirect case loaded(P?)

  public var isLoaded: Bool {
    guard case .loaded = self else { return false }
    return true
  }

  public var model: P? {
    get throws {
      guard case .loaded(let loaded) = self else {
        throw RelationError.notLoaded
      }
      return loaded
    }
  }

  public mutating func useLoaded(or load: () async throws -> P?) async throws -> P? {
    guard case .loaded(let loaded) = self else {
      let optionalParent = try await load()
      self = .loaded(optionalParent)
      return optionalParent
    }
    return loaded
  }
}

public enum OptionalChild<C: Duet.Identifiable> {
  case notLoaded
  indirect case loaded(C?)

  public var isLoaded: Bool {
    guard case .loaded = self else { return false }
    return true
  }

  public var model: C? {
    get throws {
      guard case .loaded(let loaded) = self else {
        throw RelationError.notLoaded
      }
      return loaded
    }
  }

  public mutating func useLoaded(or load: () async throws -> C?) async throws -> C? {
    guard case .loaded(let loaded) = self else {
      let optionalChild = try await load()
      self = .loaded(optionalChild)
      return optionalChild
    }
    return loaded
  }
}

extension Children: Sendable where C: Sendable {}
extension Siblings: Sendable where C: Sendable {}
extension Parent: Sendable where P: Sendable {}
extension OptionalParent: Sendable where P: Sendable {}
extension OptionalChild: Sendable where C: Sendable {}
extension Children: Equatable where C: Equatable {}
extension Siblings: Equatable where C: Equatable {}
extension Parent: Equatable where P: Equatable {}
extension OptionalParent: Equatable where P: Equatable {}
extension OptionalChild: Equatable where C: Equatable {}

public func connect<P: Duet.Identifiable, C: Duet.Identifiable>(
  _ parent: inout P,
  _ toChildren: WritableKeyPath<P, Children<C>>,
  to child: inout C,
  _ toParent: WritableKeyPath<C, Parent<P>>
) {
  child[keyPath: toParent] = .loaded(parent)
  parent[keyPath: toChildren] = .loaded([child])
}

public func connect<P: Duet.Identifiable, C: Duet.Identifiable>(
  _ parent: inout P,
  _ toChildren: WritableKeyPath<P, OptionalChild<C>>,
  to child: inout C?,
  _ toParent: WritableKeyPath<C, Parent<P>>
) {
  parent[keyPath: toChildren] = .loaded(child)
  child?[keyPath: toParent] = .loaded(parent)
}

public func connect<P: Duet.Identifiable, C: Duet.Identifiable>(
  _ parent: inout P,
  _ toChildren: WritableKeyPath<P, OptionalChild<C>>,
  to child: inout C?,
  _ toParent: WritableKeyPath<C, OptionalParent<P>>
) {
  parent[keyPath: toChildren] = .loaded(child)
  child?[keyPath: toParent] = .loaded(parent)
}
