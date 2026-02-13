import XCTest
import XExpect

@testable import App

final class EditionValidityTests: AppTestCase, @unchecked Sendable {
  func testEditorOnNonUpdatedEditionInvalid() async {
    var edition = Edition.valid
    edition.editor = "Bob"
    edition.type = .original
    await expect(edition.isValid()).toBeFalse()
  }

  func testSpanishUpdatedEditionsShouldNotHaveEditor() async throws {
    var edition = Edition.valid
    edition.editor = "Bob"
    edition.type = .updated

    // allowed because we can't resolve the language, no joined entities
    await expect(edition.isValid()).toBeTrue()

    let entities = await Entities.create {
      $0.edition.editor = "Bob"
      $0.edition.type = .updated
      $0.friend.lang = .es // <-- problem
    }

    await expect(entities.edition.model.isValid()).toBeFalse()
  }

  func testLoadedChaptersWithNonSequentialOrderInvalid() async throws {
    let entities = await Entities.create { $0.editionChapter.order = 1 }
    try await Current.db.create(EditionChapter(
      editionId: entities.edition.id,
      order: 3, // <-- unexpected non-sequential order
      shortHeading: "",
      isIntermediateTitle: false,
    ))
    await expect(entities.edition.model.isValid()).toBeFalse()
  }
}
