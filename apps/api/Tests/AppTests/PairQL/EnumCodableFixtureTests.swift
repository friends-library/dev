import Foundation
import XCTest

@testable import App

final class EnumCodableFixtureTests: XCTestCase {
  private let encoder: JSONEncoder = {
    let encoder = JSONEncoder()
    encoder.outputFormatting = .sortedKeys
    return encoder
  }()

  func testDeleteEntitiesInputWireFormat() throws {
    let id = EditionImpression.Id(UUID(uuidString: "00000000-0000-0000-0000-000000000001")!)
    try self.assertWireFormat(
      DeleteEntities.Input.editionImpression(id: id),
      #"{"case":"editionImpression","id":"00000000-0000-0000-0000-000000000001"}"#,
    )
  }

  func testAdminRouteUpsertWireFormat() throws {
    let id = DocumentTag.Id(UUID(uuidString: "00000000-0000-0000-0000-000000000001")!)
    let documentId = Document.Id(UUID(uuidString: "00000000-0000-0000-0000-000000000002")!)
    try self.assertWireFormat(
      AdminRoute.Upsert.documentTag(entity: .init(
        id: id,
        documentId: documentId,
        type: .journal,
      )),
      #"""
      {"case":"documentTag","entity":{"documentId":"00000000-0000-0000-0000-000000000002","id":"00000000-0000-0000-0000-000000000001","type":"journal"}}
      """#,
    )
  }

  func testNewsFeedItemKindWireFormat() throws {
    try self.assertWireFormat(
      NewsFeedItems.NewsFeedItem.Kind.spanishTranslation(
        isCompilation: true,
        friendName: "George Fox",
        englishHtmlShortTitle: "Journal",
      ),
      #"""
      {"case":"spanishTranslation","englishHtmlShortTitle":"Journal","friendName":"George Fox","isCompilation":true}
      """#,
    )
  }

  func testPrintJobOutputWireFormat() throws {
    try self.assertWireFormat(
      GetPrintJobExploratoryMetadata.Output.success(metadata: .init(
        shippingLevel: .priorityMail,
        shipping: 500,
        taxes: 21,
        fees: 30,
        creditCardFeeOffset: 42,
      )),
      #"""
      {"case":"success","metadata":{"creditCardFeeOffset":42,"fees":30,"shipping":500,"shippingLevel":"priorityMail","taxes":21}}
      """#,
    )

    try self.assertWireFormat(
      GetPrintJobExploratoryMetadata.Output.shippingAddressError(.init(message: "Bad address")),
      #"{"case":"shippingAddressError","message":"Bad address"}"#,
    )

    try self.assertWireFormat(
      GetPrintJobExploratoryMetadata.Output.shippingNotPossible,
      #"{"case":"shippingNotPossible"}"#,
    )
  }

  private func assertWireFormat<Value: Codable & Equatable>(
    _ value: Value,
    _ expected: String,
    file: StaticString = #filePath,
    line: UInt = #line,
  ) throws {
    let data = try self.encoder.encode(value)
    XCTAssertEqual(String(decoding: data, as: UTF8.self), expected, file: file, line: line)
    XCTAssertEqual(try JSONDecoder().decode(Value.self, from: data), value, file: file, line: line)
  }
}
