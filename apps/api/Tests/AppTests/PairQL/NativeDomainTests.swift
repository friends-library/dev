import DuetSQL
import XCTest
import XExpect

@testable import App

final class NativeDomainTests: AppTestCase, @unchecked Sendable {
  func testReportNativeAppError() async throws {
    let installId = UUID().lowercased
    let output = try await ReportError.resolve(
      with: .init(
        buildSemver: "3.3.3",
        buildNumber: 101,
        lang: .en,
        detail: "printer on fire",
        platform: "ios",
        installId: installId,
        errorMessage: "whoops",
        errorStack: nil,
      ),
      in: .init(requestId: "someid".random),
    )

    expect(output).toEqual(.success)

    let retrieved = try await NativeAppError.query()
      .where(.installId == installId)
      .first(in: self.db)

    expect(retrieved.buildSemver).toEqual("3.3.3")
    expect(retrieved.buildNumber).toEqual(101)
    expect(retrieved.lang).toEqual(.en)
    expect(retrieved.detail).toEqual("printer on fire")
    expect(retrieved.platform).toEqual("ios")
    expect(retrieved.installId).toEqual(installId)
    expect(retrieved.errorMessage).toEqual("whoops")
    expect(retrieved.errorStack).toBeNil()
  }
}
