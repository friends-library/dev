import XCTest
import XExpect

@testable import App

final class AudioPartValidityTests: XCTestCase {
  override static func setUp() {
    Current.logger = .null
  }

  func testEmptyTitleInvalid() async {
    var part = AudioPart.valid
    part.title = ""
    await expect(part.isValid()).toBeFalse()
  }

  func testTooSmallDurationInvalid() async {
    var part = AudioPart.valid
    part.duration = 120
    await expect(part.isValid()).toBeFalse()
  }

  func testTooSmallDurationValidIfNotPublished() async {
    var part = AudioPart.valid
    part.mp3SizeLq = 0
    part.mp3SizeHq = 0
    part.duration = 120
    await expect(part.isValid()).toBeTrue()
  }

  func testNegativeValuesForMp3SizeInvalid() async {
    var part = AudioPart.valid
    part.mp3SizeHq = -1
    await expect(part.isValid()).toBeFalse()
    part = AudioPart.valid
    part.mp3SizeLq = -1
    await expect(part.isValid()).toBeFalse()
  }

  func testSameSizeForMp3HqLqInvalid() async {
    var part = AudioPart.valid
    part.mp3SizeHq = 888_888
    part.mp3SizeLq = 888_888
    await expect(part.isValid()).toBeFalse()
  }

  func testLqMp3LargerThanHqInvalid() async {
    var part = AudioPart.valid
    part.mp3SizeHq = 888_888
    part.mp3SizeLq = 999_999
    await expect(part.isValid()).toBeFalse()
  }

  func testOrderLessThan1Iinvalid() async {
    var part = AudioPart.valid
    part.order = 0
    await expect(part.isValid()).toBeFalse()
  }

  func testNegativeChapterValueInvalid() async {
    var part = AudioPart.valid
    part.chapters = .init(-5)
    await expect(part.isValid()).toBeFalse()
  }

  func testNonSequencedChaptersInvalid() async {
    var part = AudioPart.valid
    part.chapters = .init(3, 5)
    await expect(part.isValid()).toBeFalse()
  }

  func testZeroDraftStateItemsValid() async {
    var part = AudioPart.valid
    part.mp3SizeHq = 0
    part.mp3SizeLq = 0
    await expect(part.isValid()).toBeTrue()
  }

  func testTempNoteToListenerAllowedWithSmallerSize() async {
    var part = AudioPart.valid
    part.title = "Nota para el oyente"
    part.mp3SizeLq = 300_000
    part.mp3SizeHq = 400_000
    part.duration = 25
    await expect(part.isValid()).toBeTrue()
  }
}
