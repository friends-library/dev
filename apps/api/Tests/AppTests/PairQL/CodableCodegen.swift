import Foundation
import TypeScriptInterop
import XCTest

@testable import App

final class Codegen: AppTestCase {
  func test_codegenSwift() throws {
    if envVarSet("CODEGEN_SWIFT") {
      try ApiTypeScriptEnumsCodableGenerator().write()
    }
  }
}

struct ApiTypeScriptEnumsCodableGenerator: AggregateCodeGenerator {
  var generators: [CodeGenerator] = [
    EnumCodableGen.EnumsGenerator(
      path: "\(requireEnvVar("DEV_ROOT_PATH"))/apps/api/Sources/App/PairQL/Codegen/Enums+Codable.swift",
      types: [
        (DeleteEntities.Input.self, false),
        (AdminRoute.Upsert.self, false),
        (NewsFeedItems.NewsFeedItem.Kind.self, false),
        (GetPrintJobExploratoryMetadata.Output.self, false),
      ],
      imports: [
        "Tagged": "Tagged",
        "TaggedTime": "TaggedTime",
        "TaggedMoney": "TaggedMoney",
      ],
      replacements: [
        "Foundation.UUID": "UUID",
        "Tagged.Tagged": "Tagged",
      ]
    ),
  ]

  func format() throws {
    let proc = Process()
    proc.executableURL = URL(fileURLWithPath: requireEnvVar("SWIFT_FORMAT_BIN"))
    proc.arguments = generators.compactMap { generator in
      (generator as? EnumCodableGen.EnumsGenerator)?.path
    }
    try proc.run()
  }
}

// helpers

private func envVarSet(_ name: String) -> Bool {
  ProcessInfo.processInfo.environment[name] != nil
}

private func requireEnvVar(_ name: String) -> String {
  guard let value = ProcessInfo.processInfo.environment[name] else {
    fatalError("Missing required environment variable: `\(name)`")
  }
  return value
}
