import XCTest

@testable import App

final class AudioValidityTests: XCTestCase {
  override static func setUp() {
    Current.logger = .null
  }

  func testEmptyReaderInvalid() {
    let audio = Audio.valid
    audio.reader = ""
    XCTAssertFalse(audio.isValid)
  }

  func testM4bLqNotSmallerThanHqInvalid() {
    let audio = Audio.valid
    audio.m4bSizeHq = 9_000_000
    audio.m4bSizeLq = 9_000_111
    XCTAssertFalse(audio.isValid)
  }

  func testMp3ZipLqNotSmallerThanHqInvalid() {
    let audio = Audio.valid
    audio.mp3ZipSizeHq = 6_000_000
    audio.mp3ZipSizeLq = 7_000_000
    XCTAssertFalse(audio.isValid)
  }

  func testZeroFilesizesValid() {
    let audio = Audio.valid
    audio.mp3ZipSizeHq = 0
    audio.mp3ZipSizeLq = 0
    audio.m4bSizeHq = 0
    audio.m4bSizeLq = 0
    XCTAssertTrue(audio.isValid)
  }

  func testTooSmallNonZeroM4bSizeInvalid() {
    var audio = Audio.valid
    audio.m4bSizeHq = 1000
    XCTAssertFalse(audio.isValid)
    audio = Audio.valid
    audio.m4bSizeLq = 1000
    XCTAssertFalse(audio.isValid)
  }

  func testTooSmallNonZeroMp3ZipSizeInvalid() {
    var audio = Audio.valid
    audio.mp3ZipSizeHq = 1000
    XCTAssertFalse(audio.isValid)
    audio = Audio.valid
    audio.mp3ZipSizeLq = 1000
    XCTAssertFalse(audio.isValid)
  }

  func testNonSequentialPartsInvalid() {
    let part1 = AudioPart.valid
    part1.order = 1
    let part2 = AudioPart.valid
    part2.order = 3 // <-- unexpected non-sequential order!!!

    let audio = Audio.valid
    audio.parts = .loaded([part1, part2])
    XCTAssertFalse(audio.isValid)
  }
}
