import XCTest

@testable import App

final class EditionImpressionValidityTests: XCTestCase {
  func testOutOfBoundPaperbackVolumesInvalid() {
    var impression = EditionImpression.valid
    impression.paperbackVolumes = .init(0)
    XCTAssertFalse(impression.isValid)
    impression.paperbackVolumes = .init(100, 999_999)
    XCTAssertFalse(impression.isValid)
  }

  func testOutOfBoundsAdocLengthInvalid() {
    var impression = EditionImpression.valid
    impression.adocLength = 100
    XCTAssertFalse(impression.isValid)
    impression.adocLength = 33_333_333_333
    XCTAssertFalse(impression.isValid)
  }

  func testNonGitCommitFullShaPublishedRevisionInvalid() {
    var impression = EditionImpression.valid
    impression.publishedRevision = "not a sha"
    XCTAssertFalse(impression.isValid)
  }

  func testNonGitCommitFullShaProductionToolchainRevisionInvalid() {
    var impression = EditionImpression.valid
    impression.productionToolchainRevision = "not a sha"
    XCTAssertFalse(impression.isValid)
  }
}
