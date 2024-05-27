import XCTest
import XExpect

@testable import App

final class EditionImpressionValidityTests: XCTestCase {
  func testOutOfBoundPaperbackVolumesInvalid() async {
    var impression = EditionImpression.valid
    impression.paperbackVolumes = .init(0)
    expect(await impression.isValid()).toBeFalse()
    impression.paperbackVolumes = .init(100, 999_999)
    expect(await impression.isValid()).toBeFalse()
  }

  func testOutOfBoundsAdocLengthInvalid() async {
    var impression = EditionImpression.valid
    impression.adocLength = 100
    expect(await impression.isValid()).toBeFalse()
    impression.adocLength = 33_333_333_333
    expect(await impression.isValid()).toBeFalse()
  }

  func testNonGitCommitFullShaPublishedRevisionInvalid() async {
    var impression = EditionImpression.valid
    impression.publishedRevision = "not a sha"
    expect(await impression.isValid()).toBeFalse()
  }

  func testNonGitCommitFullShaProductionToolchainRevisionInvalid() async {
    var impression = EditionImpression.valid
    impression.productionToolchainRevision = "not a sha"
    expect(await impression.isValid()).toBeFalse()
  }
}
