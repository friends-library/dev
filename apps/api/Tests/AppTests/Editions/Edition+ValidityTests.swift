import XCTest
import XExpect

@testable import App

final class EditionValidityTests: XCTestCase {
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
    // allowed because we can't resolve the language, relations not loaded
    expect(await edition.isValid()).toBeTrue()

    // var friend = Friend.empty
    // friend.lang = .es
    // var document = Document.valid
    // document.friend = .loaded(friend)
    // edition.document = .loaded(document)

    // // now we now it's invalid, because we know the lang is spanish
    // XCTAssertFalse(edition.isValid)
  }

  // func testLoadedChaptersWithNonSequentialOrderInvalid() async {
  //   var edition = Edition.valid
  //   var chapter1 = EditionChapter.valid
  //   chapter1.order = 1
  //   var chapter2 = EditionChapter.valid
  //   chapter2.order = 3 // <-- unexpected non-sequential order
  //   edition.chapters = .loaded([chapter1, chapter2])
  //   XCTAssertFalse(edition.isValid)
  // }
}
