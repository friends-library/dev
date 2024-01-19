import XCTest

@testable import App

final class AudioPartValidityTests: XCTestCase {
  override static func setUp() {
    Current.logger = .null
  }

  func testEmptyTitleInvalid() {
    let part = AudioPart.valid
    part.title = ""
    XCTAssertFalse(part.isValid)
  }

  func testTooSmallDurationInvalid() {
    let part = AudioPart.valid
    part.duration = 120
    XCTAssertFalse(part.isValid)
  }

  func testTooSmallDurationValidIfNotPublished() {
    let part = AudioPart.valid
    part.mp3SizeLq = 0
    part.mp3SizeHq = 0
    part.duration = 120
    XCTAssertTrue(part.isValid)
  }

  func testNegativeValuesForMp3SizeInvalid() {
    var part = AudioPart.valid
    part.mp3SizeHq = -1
    XCTAssertFalse(part.isValid)
    part = AudioPart.valid
    part.mp3SizeLq = -1
    XCTAssertFalse(part.isValid)
  }

  func testSameSizeForMp3HqLqInvalid() {
    let part = AudioPart.valid
    part.mp3SizeHq = 888_888
    part.mp3SizeLq = 888_888
    XCTAssertFalse(part.isValid)
  }

  func testLqMp3LargerThanHqInvalid() {
    let part = AudioPart.valid
    part.mp3SizeHq = 888_888
    part.mp3SizeLq = 999_999
    XCTAssertFalse(part.isValid)
  }

  func testOrderLessThan1Iinvalid() {
    let part = AudioPart.valid
    part.order = 0
    XCTAssertFalse(part.isValid)
  }

  func testNegativeChapterValueInvalid() {
    let part = AudioPart.valid
    part.chapters = .init(-5)
    XCTAssertFalse(part.isValid)
  }

  func testNonSequencedChaptersInvalid() {
    let part = AudioPart.valid
    part.chapters = .init(3, 5)
    XCTAssertFalse(part.isValid)
  }

  func testZeroDraftStateItemsValid() {
    let part = AudioPart.valid
    part.mp3SizeHq = 0
    part.mp3SizeLq = 0
    XCTAssertTrue(part.isValid)
  }

  func testTempNoteToListenerAllowedWithSmallerSize() {
    let part = AudioPart.valid
    part.title = "Nota para el oyente"
    part.mp3SizeLq = 300_000
    part.mp3SizeHq = 400_000
    part.duration = 25
    XCTAssertTrue(part.isValid)
  }
}
