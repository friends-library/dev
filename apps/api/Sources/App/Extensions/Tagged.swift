import Foundation
import PairQL
import Tagged
import TypeScriptInterop

extension Tagged: @retroactive TypeScriptAliased {
  public static var typescriptAlias: String {
    switch RawValue.self {
    case is UUID.Type: "UUID"
    case is String.Type: "string"
    case is any Numeric.Type: "number"
    case is Bool.Type: "boolean"
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
