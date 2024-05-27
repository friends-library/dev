import NonEmpty
import TaggedMoney
import XCTest

@testable import App

final class LuluTests: XCTestCase {
  func testPrices() throws {
    let cases: [(PrintSize, NonEmpty<[Int]>, Cents<Int>)] = [
      (.s, .init(10), 214),
      (.s, .init(100), 265),
      (.m, .init(100), 265),
      (.m, .init(100, 100), 530),
      (.m, .init(200), 405),
      (.m, .init(259), 488),
      (.xl, .init(400), 685),
    ]

    for (size, pages, expected) in cases {
      XCTAssertEqual(Lulu.paperbackPrice(size: size, volumes: pages), expected)
    }
  }

  func testPodPackageId() throws {
    let cases: [(PrintSize, Int, String)] = [
      (.s, 31, "0425X0687BWSTDSS060UW444GXX"),
      (.s, 32, "0425X0687BWSTDPB060UW444GXX"),
      (.s, 33, "0425X0687BWSTDPB060UW444GXX"),
      (.m, 187, "0550X0850BWSTDPB060UW444GXX"),
      (.xl, 525, "0600X0900BWSTDPB060UW444GXX"),
    ]

    for (size, pages, expected) in cases {
      XCTAssertEqual(Lulu.podPackageId(size: size, pages: pages), expected)
    }
  }
}
