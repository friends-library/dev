import XCTest
import XExpect

@testable import App

final class AudioValidityTests: XCTestCase {
  override static func setUp() {
    Current.logger = .null
  }

  func testEmptyReaderInvalid() async {
    var audio = Audio.valid
    audio.reader = ""
    expect(await audio.isValid()).toBeFalse()
  }

  func testM4bLqNotSmallerThanHqInvalid() async {
    var audio = Audio.valid
    audio.m4bSizeHq = 9_000_000
    audio.m4bSizeLq = 9_000_111
    expect(await audio.isValid()).toBeFalse()
  }

  func testMp3ZipLqNotSmallerThanHqInvalid() async {
    var audio = Audio.valid
    audio.mp3ZipSizeHq = 6_000_000
    audio.mp3ZipSizeLq = 7_000_000
    expect(await audio.isValid()).toBeFalse()
  }

  func testZeroFilesizesValid() async {
    var audio = Audio.valid
    audio.mp3ZipSizeHq = 0
    audio.mp3ZipSizeLq = 0
    audio.m4bSizeHq = 0
    audio.m4bSizeLq = 0
    expect(await audio.isValid()).toBeTrue()
  }

  func testTooSmallNonZeroM4bSizeInvalid() async {
    var audio = Audio.valid
    audio.m4bSizeHq = 1000
    expect(await audio.isValid()).toBeFalse()
    audio = Audio.valid
    audio.m4bSizeLq = 1000
    expect(await audio.isValid()).toBeFalse()
  }

  func testTooSmallNonZeroMp3ZipSizeInvalid() async {
    var audio = Audio.valid
    audio.mp3ZipSizeHq = 1000
    expect(await audio.isValid()).toBeFalse()
    audio = Audio.valid
    audio.mp3ZipSizeLq = 1000
    expect(await audio.isValid()).toBeFalse()
  }

  // func testNonSequentialPartsInvalid() async {
  //   var part1 = AudioPart.valid
  //   part1.order = 1
  //   var part2 = AudioPart.valid
  //   part2.order = 3 // <-- unexpected non-sequential order!!!

  //   var audio = Audio.valid
  //   audio.parts = .loaded([part1, part2])
  //   expect(await audio.isValid()).toBeFalse()
  // }
}
