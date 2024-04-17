import XCTest

@testable import App

final class EditionValidityTests: XCTestCase {
  func testEditorOnNonUpdatedEditionInvalid() {
    var edition = Edition.valid
    edition.editor = "Bob"
    edition.type = .original
    XCTAssertFalse(edition.isValid)
  }

  func testSpanishUpdatedEditionsShouldNotHaveEditor() {
    var edition = Edition.valid
    edition.editor = "Bob"
    edition.type = .updated
    // allowed because we can't resolve the language, relations not loaded
    XCTAssertTrue(edition.isValid)

    var friend = Friend.empty
    friend.lang = .es
    var document = Document.valid
    document.friend = .loaded(friend)
    edition.document = .loaded(document)

    // now we now it's invalid, because we know the lang is spanish
    XCTAssertFalse(edition.isValid)
  }

  // func testLoadedChaptersWithNonSequentialOrderInvalid() {
  //   var edition = Edition.valid
  //   var chapter1 = EditionChapter.valid
  //   chapter1.order = 1
  //   var chapter2 = EditionChapter.valid
  //   chapter2.order = 3 // <-- unexpected non-sequential order
  //   edition.chapters = .loaded([chapter1, chapter2])
  //   XCTAssertFalse(edition.isValid)
  // }
}
