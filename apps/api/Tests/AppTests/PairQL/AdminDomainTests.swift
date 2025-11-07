import DuetSQL
import XCTest
import XExpect

@testable import App

final class AdminDomainTests: AppTestCase, @unchecked Sendable {
  func testCreateEditionAlsoAssociatesIsbn() async throws {
    try await Isbn.random.create() // will be assigned to new edition
    let entities = await Entities.create()
    let newId = Edition.Id()

    let output = try await CreateEntity.resolve(
      with: .edition(entity: .init(
        id: newId,
        documentId: entities.document.id,
        type: .updated,
        editor: nil,
        isDraft: false,
        paperbackOverrideSize: nil,
        paperbackSplits: nil,
      )),
      in: .authed,
    )

    expect(output).toEqual(.success)
    let edition = try await Edition.find(newId)
    let isbn = try? await Isbn.query()
      .where(.editionId == edition.id)
      .first()
    expect(isbn).not.toBeNil()
  }
}
