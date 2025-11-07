import Foundation
import Vapor
import XCTest

@testable import App

final class CreateNewPrintJobTests: AppTestCase, @unchecked Sendable {
  func testNoPrintJobsCreatedIfNoOrdersInPresubmitStatus() async throws {
    await OrderPrintJobCoordinator.createNewPrintJobs { _ in throw Fail() }
  }

  func testCreateNewPrintJobHappyPath() async throws {
    var order = Order.random
    order.printJobStatus = .presubmit
    try await Current.db.create(order)
    var created: [Order] = []

    await OrderPrintJobCoordinator.createNewPrintJobs {
      created.append($0)
      return .init(id: 33, status: .init(name: .created), lineItems: [])
    }

    let updated = try await Current.db.find(order.id)
    XCTAssertEqual(created.first, order)
    XCTAssertEqual(created.count, 1)
    XCTAssertEqual(updated.printJobId, 33)
    XCTAssertEqual(updated.printJobStatus, .pending)
    XCTAssertEqual(sent.slacks, [.order("Created print job 33 for order \(order.id.lowercased)")])
  }

  func testUnexpectedLuluStatusLogsErrorWithoutUpdatingOrder() async throws {
    var order = Order.random
    order.printJobStatus = .presubmit
    try await Current.db.create(order)

    await OrderPrintJobCoordinator.createNewPrintJobs { _ in
      .init(id: 33, status: .init(name: .error), lineItems: [])
    }

    let retrieved = try await Current.db.find(order.id)
    XCTAssertEqual(
      sent.slacks,
      [.error("Unexpected print job status `ERROR` for order \(order.id.lowercased)")],
    )
    XCTAssertEqual(retrieved.printJobStatus, .presubmit)
    XCTAssertEqual(retrieved.printJobId, nil)
  }
}

struct Fail: Error {
  init(_ msg: String = "", file: StaticString = #filePath, line: UInt = #line) {
    XCTFail(msg, file: file, line: line)
  }
}
