import NonEmpty
import TypeScriptInterop

extension NonEmpty {
  enum InitError: Error {
    case emptyCollection
  }
}

extension NonEmpty {
  var array: [Element] {
    [first] + dropFirst()
  }
}

extension NonEmpty: @retroactive TypeScriptAliased {
  public static var typescriptAlias: String {
    switch Element.self {
    case is String.Type: return "[string, ...string[]]"
    case is any Numeric.Type: return "[number, ...number[]]"
    case is Bool.Type: return "[boolean, ...boolean[]]"
    default: fatalError("Typescript alias not declared for NonEmpty<[\(Element.self)]>")
    }
  }
}

extension NonEmpty where Collection: RangeReplaceableCollection {
  static func fromArray(_ collection: Collection) throws -> NonEmpty<Collection> {
    guard let first = collection.first else { throw InitError.emptyCollection }
    return NonEmpty<Collection>(first) + collection.dropFirst()
  }
}
