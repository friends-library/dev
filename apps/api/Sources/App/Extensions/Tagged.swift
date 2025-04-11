import Foundation
import PairQL
import Tagged
import TypeScriptInterop

extension Tagged: @retroactive TypeScriptAliased {
  public static var typescriptAlias: String {
    switch RawValue.self {
    case is UUID.Type: return "UUID"
    case is String.Type: return "string"
    case is any Numeric.Type: return "number"
    case is Bool.Type: return "boolean"
    default: fatalError("Typescript alias not declared for tagged `\(RawValue.self)`")
    }
  }
}

public extension Tagged where RawValue == UUID {
  init() {
    self.init(rawValue: Current.uuid())
  }
}

extension Tagged: @retroactive PairInput where RawValue: Codable & Equatable {}
extension Tagged: @retroactive PairOutput where RawValue == UUID {}
