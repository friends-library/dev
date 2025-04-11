import XCTVapor
import XExpect

@testable import App

final class JsErrorLoggingTests: AppTestCase, @unchecked Sendable {
  func testLoggingJsError() async throws {
    let output = try await LogJsError.resolve(
      with: .init(
        userAgent: "operafox",
        url: "/some-url",
        location: "/some-location",
        additionalInfo: nil,
        errorMessage: nil,
        errorName: nil,
        errorStack: nil,
        event: nil,
        source: nil,
        lineNumber: 33,
        colNumber: nil
      ),
      in: .mock
    )

    expect(output).toEqual(.success)
    XCTAssertEqual(sent.slacks.count, 1)
    XCTAssertEqual(sent.slacks.first?.channel, .errors)
    XCTAssertContains(sent.slacks.first?.message.text, "operafox")
  }
}
