import TaggedTime
import XCTest

@testable import App

let MINUTE = Seconds<Double>(rawValue: 60.0)
let HOUR = Seconds<Double>(rawValue: 60.0 * 60.0)

final class AudioUtilTests: XCTestCase {

  func testClockStyle() {
    let cases: [([Seconds<Double>], String)] = [
      ([MINUTE, MINUTE, MINUTE, 5.2], "3:05"),
      ([HOUR * 3, MINUTE * 5, 5], "3:05:05"),
      ([HOUR * 5, MINUTE * 19, 43], "5:19:43"),
      ([3318], "55:18"),
      ([3203], "53:23"),
      ([1815, 1807, 1834, 1691, 2573], "2:42:00"),
      ([3], "3"),
    ]
    for (durations, expected) in cases {
      XCTAssertEqual(
        AudioUtil.humanDuration(partDurations: durations, style: .clock),
        expected
      )
    }
  }

  func testAbbrevStyle() {
    let cases: [([Seconds<Double>], String, Lang)] = [
      ([HOUR * 3], "3 hr", .en),
      ([HOUR * 3], "3 h", .es),
      ([HOUR * 3, 5 * MINUTE], "3 hr 5 min", .en),
      ([HOUR * 3, 5 * MINUTE], "3 h 5 min", .es),
      ([MINUTE * 13], "13 min", .en),
      ([MINUTE * 13], "13 min", .es),
    ]
    for (durations, expected, lang) in cases {
      XCTAssertEqual(
        AudioUtil.humanDuration(partDurations: durations, style: .abbrev(lang)),
        expected
      )
    }
  }
}
