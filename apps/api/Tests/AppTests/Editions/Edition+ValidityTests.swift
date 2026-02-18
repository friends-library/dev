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

  func testEditorAllowedOnOutOfBandEditions() async throws {
    let original = await Entities.create {
      $0.edition.editor = "Bob"
      $0.edition.type = .original
      $0.friend.outOfBand = true
      $0.editionChapter.order = 1
    }
    await expect(original.edition.model.isValid()).toBeTrue()

    let spanish = await Entities.create {
      $0.edition.editor = "Bob"
      $0.edition.type = .updated
      $0.friend.lang = .es
      $0.friend.outOfBand = true
      $0.editionChapter.order = 1
    }
    await expect(spanish.edition.model.isValid()).toBeTrue()
  }

  func testLoadedChaptersWithNonSequentialOrderInvalid() async throws {
    let entities = await Entities.create { $0.editionChapter.order = 1 }
    try await self.db.create(EditionChapter(
      editionId: entities.edition.id,
      order: 3, // <-- unexpected non-sequential order
      shortHeading: "",
      isIntermediateTitle: false,
    ))
    await expect(entities.edition.model.isValid()).toBeFalse()
  }
}
