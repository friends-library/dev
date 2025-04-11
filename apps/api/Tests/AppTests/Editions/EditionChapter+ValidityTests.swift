import XCTest
import XExpect

@testable import App

final class EditionChapterValidityTests: XCTestCase {
  func testOrderLessThan1OrSuperBigInvalid() async {
    var chapter = EditionChapter.valid
    chapter.order = 0
    await expect(chapter.isValid()).toBeFalse()
    chapter.order = 400
    await expect(chapter.isValid()).toBeFalse()
  }

  func testWierdValueForSequenceNumberInvalid() async {
    var chapter = EditionChapter.valid
    chapter.sequenceNumber = 0
    await expect(chapter.isValid()).toBeFalse()
    chapter.sequenceNumber = 201
    await expect(chapter.isValid()).toBeFalse()
  }

  func testEmptyOrNonCapitalizedShortHeadingInvalid() async {
    var chapter = EditionChapter.valid
    chapter.shortHeading = ""
    await expect(chapter.isValid()).toBeFalse()
    chapter.shortHeading = "bad lowercased"
    await expect(chapter.isValid()).toBeFalse()
  }

  func testEmptyOrNonCapitalizedNonSequenceTitleInvalid() async {
    var chapter = EditionChapter.valid
    chapter.nonSequenceTitle = ""
    await expect(chapter.isValid()).toBeFalse()
    chapter.nonSequenceTitle = "bad lowercased"
    await expect(chapter.isValid()).toBeFalse()
  }

  func testSequenceNumberAndNonSequenceTitleBothNullInvalid() async {
    var chapter = EditionChapter.valid
    chapter.sequenceNumber = nil
    chapter.nonSequenceTitle = nil
    await expect(chapter.isValid()).toBeFalse()
  }
}
