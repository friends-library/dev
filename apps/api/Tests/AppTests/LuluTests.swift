import NonEmpty
import TaggedMoney
import Testing

@testable import App

@Suite struct LuluTests {
  @Test func prices() {
    let cases: [(PrintSize, NonEmpty<[Int]>, Cents<Int>)] = [
      (.s, .init(10), 401),
      (.s, .init(100), 447),
      (.m, .init(100), 447),
      (.m, .init(100, 100), 894),
      (.m, .init(200), 696),
      (.m, .init(259), 843),
      (.xl, .init(400), 1195),
    ]

    for (size, pages, expected) in cases {
      #expect(Lulu.paperbackPrice(size: size, volumes: pages) == expected)
    }
  }

  @Test func `pod package id`() {
    let cases: [(PrintSize, Int, String)] = [
      (.s, 31, "0425X0687.BW.STD.SS.060UW444.GXX"),
      (.s, 32, "0425X0687.BW.STD.PB.060UW444.GXX"),
      (.s, 33, "0425X0687.BW.STD.PB.060UW444.GXX"),
      (.m, 187, "0550X0850.BW.STD.PB.060UW444.GXX"),
      (.xl, 525, "0600X0900.BW.STD.PB.060UW444.GXX"),
    ]

    for (size, pages, expected) in cases {
      #expect(Lulu.podPackageId(size: size, pages: pages) == expected)
    }
  }
}
