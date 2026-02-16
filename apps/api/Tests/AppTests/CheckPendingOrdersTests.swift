import Dependencies
import DuetSQL
import Foundation
import Vapor
import XCTest

@testable import App

final class CheckPendingOrdersTests: AppTestCase, @unchecked Sendable {
  func testCheckPendingOrdersHappyPath() async throws {
    var order = Order.mock
    order.printJobStatus = .pending
    order.printJobId = 33
    try await self.db.delete(all: Order.self)
    try await self.db.create(order)

    await withDependencies {
      $0.luluClient.listPrintJobs = { ids in
        XCTAssertEqual(ids, .init(33))
        return [.init(
          id: 33,
          status: .init(name: .productionDelayed),
          lineItems: [],
        )]
      }
    } operation: {
      await OrderPrintJobCoordinator.checkPendingOrders()
    }

    let retrieved = try await self.db.find(order.id)
    XCTAssertEqual(retrieved.printJobStatus, .accepted)
    XCTAssertEqual(
      sent.slacks,
      [.order("Verified acceptance of print job 33, status: `PRODUCTION_DELAYED`")],
    )
  }

  func testSlackLogsErrorIfDbThrows() async throws {
    await withDependencies {
      $0.db = ThrowingClient()
    } operation: {
      await OrderPrintJobCoordinator.checkPendingOrders()
    }
    XCTAssertEqual(sent.slacks.count, 1)
    XCTAssertEqual(sent.slacks[0].channel, .errors)
  }

  func testSlackLogsErrorIfOrderMissingPrintJobId() async throws {
    try await self.db.delete(all: Order.self)
    var order = Order.mock
    order.printJobStatus = .pending
    order.printJobId = nil // <-- should never happen
    try await self.db.create(order)

    await OrderPrintJobCoordinator.checkPendingOrders()

    XCTAssertEqual(
      sent.slacks,
      [.error("Unexpected missing print job id in orders: [\(order.id)]")],
    )
  }

  func testRejectedPrintJobUpdatedAndSlacked() async throws {
    try await self.db.delete(all: Order.self)
    var order = Order.mock
    order.printJobStatus = .pending
    order.printJobId = 33
    try await self.db.create(order)

    await withDependencies {
      $0.luluClient.listPrintJobs = { _ in
        [
          .init(
            id: 33,
            status: .init(name: .rejected),
            lineItems: [],
          ),
        ]
      }
    } operation: {
      await OrderPrintJobCoordinator.checkPendingOrders()
    }

    let retrieved = try await self.db.find(order.id)
    XCTAssertEqual(retrieved.printJobStatus, .rejected)
    XCTAssertEqual(
      sent.slacks,
      [.error("Print job 33 for order \(order.id.lowercased) rejected")],
    )
  }
}

extension String: @retroactive Error {}
