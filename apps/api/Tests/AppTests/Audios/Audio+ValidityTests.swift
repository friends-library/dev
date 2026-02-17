import XCTest
import XExpect

@testable import App

final class AudioValidityTests: AppTestCase, @unchecked Sendable {
  func testEmptyReaderInvalid() async {
    var audio = Audio.valid
    audio.reader = ""
    await expect(audio.isValid()).toBeFalse()
  }

  func testM4bLqNotSmallerThanHqInvalid() async {
    var audio = Audio.valid
    audio.m4bSizeHq = 9_000_000
    audio.m4bSizeLq = 9_000_111
    await expect(audio.isValid()).toBeFalse()
  }

  func testMp3ZipLqNotSmallerThanHqInvalid() async {
    var audio = Audio.valid
    audio.mp3ZipSizeHq = 6_000_000
    audio.mp3ZipSizeLq = 7_000_000
    await expect(audio.isValid()).toBeFalse()
  }

  func testZeroFilesizesValid() async {
    var audio = Audio.valid
    audio.mp3ZipSizeHq = 0
    audio.mp3ZipSizeLq = 0
    audio.m4bSizeHq = 0
    audio.m4bSizeLq = 0
    await expect(audio.isValid()).toBeTrue()
  }

  func testTooSmallNonZeroM4bSizeInvalid() async {
    var audio = Audio.valid
    audio.m4bSizeHq = 1000
    await expect(audio.isValid()).toBeFalse()
    audio = Audio.valid
    audio.m4bSizeLq = 1000
    await expect(audio.isValid()).toBeFalse()
  }

  func testTooSmallNonZeroMp3ZipSizeInvalid() async {
    var audio = Audio.valid
    audio.mp3ZipSizeHq = 1000
    await expect(audio.isValid()).toBeFalse()
    audio = Audio.valid
    audio.mp3ZipSizeLq = 1000
    await expect(audio.isValid()).toBeFalse()
  }

  func testNonSequentialPartsInvalid() async throws {
    let audio = await Entities.create { $0.audioPart.order = 1 }.audio
    var part2 = AudioPart.valid
    part2.audioId = audio.id
    part2.order = 3 // <-- unexpected non-sequential order!!!
    try await self.db.create(part2)
    await expect(audio.model.isValid()).toBeFalse()
  }
}
