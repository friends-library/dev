// auto-generated, do not edit
import DuetMock
import GraphQL

@testable import App

extension DocumentTag {
  static var mock: DocumentTag {
    DocumentTag(documentId: .init(), type: .journal)
  }

  static var empty: DocumentTag {
    DocumentTag(documentId: .init(), type: .journal)
  }

  static var random: DocumentTag {
    DocumentTag(documentId: .init(), type: TagType.allCases.shuffled().first!)
  }

  func gqlMap(omitting: Set<String> = []) -> GraphQL.Map {
    var map: GraphQL.Map = .dictionary([
      "id": .string(id.lowercased),
      "documentId": .string(documentId.lowercased),
      "type": .string(type.rawValue),
    ])
    omitting.forEach { try? map.remove($0) }
    return map
  }
}
