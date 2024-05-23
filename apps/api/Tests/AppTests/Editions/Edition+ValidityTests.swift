import XCTest
import XExpect

@testable import App

final class EditionValidityTests: AppTestCase {
  func testEditorOnNonUpdatedEditionInvalid() async {
    var edition = Edition.valid
    edition.editor = "Bob"
    edition.type = .original
    expect(await edition.isValid()).toBeFalse()
  }

  func testSpanishUpdatedEditionsShouldNotHaveEditor() async {
    var edition = Edition.valid
    edition.editor = "Bob"
    edition.type = .updated

    // allowed because we can't resolve the language, no joined entities
    expect(await edition.isValid()).toBeTrue()

    let entities = await Entities.create {
      $0.edition.editor = "Bob"
      $0.edition.type = .updated
      $0.friend.lang = .es // <-- problem
    }

    expect(await entities.edition.model.isValid()).toBeFalse()
  }

  func testLoadedChaptersWithNonSequentialOrderInvalid() async {
    let entities = await Entities.create { $0.editionChapter.order = 1 }
    try! await EditionChapter.create(.init(
      editionId: entities.edition.id,
      order: 3, // <-- unexpected non-sequential order
      shortHeading: "",
      isIntermediateTitle: false
    ))
    expect(await entities.edition.model.isValid()).toBeFalse()
  }
}
