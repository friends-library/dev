import Dependencies
import Foundation
import Testing

@testable import App

@Suite struct EditionImpressionValidityTests {
  init() {
    prepareDependencies { $0.uuid = UUIDGenerator { UUID() } }
  }

  @Test func `out of bound paperback volumes invalid`() async {
    var impression = EditionImpression.valid
    impression.paperbackVolumes = .init(0)
    #expect(await impression.isValid() == false)
    impression.paperbackVolumes = .init(100, 999_999)
    #expect(await impression.isValid() == false)
  }

  @Test func `out of bounds adoc length invalid`() async {
    var impression = EditionImpression.valid
    impression.adocLength = 100
    #expect(await impression.isValid() == false)
    impression.adocLength = 33_333_333_333
    #expect(await impression.isValid() == false)
  }

  @Test func `non-git-commit full sha published revision invalid`() async {
    var impression = EditionImpression.valid
    impression.publishedRevision = "not a sha"
    #expect(await impression.isValid() == false)
  }

  @Test func `non-git-commit full sha production toolchain revision invalid`() async {
    var impression = EditionImpression.valid
    impression.productionToolchainRevision = "not a sha"
    #expect(await impression.isValid() == false)
  }
}
