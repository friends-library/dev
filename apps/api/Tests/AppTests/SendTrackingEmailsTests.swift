import Foundation
import XCTest

@testable import App

final class SendTrackingEmailsTests: AppTestCase {
  var order = Order.mock

  override func setUp() {
    super.setUp()
    order = Order.mock
    order.email = "foo@bar.com"
    order.printJobStatus = .accepted
    order.printJobId = 33
  }

  func testCheckSendTrackingEmailsHappyPath() async throws {
    try await Current.db.deleteAll(Order.self)
    try await Current.db.create(order)

    Current.luluClient.listPrintJobs = { ids in
      XCTAssertEqual(ids, .init(33))
      return [.init(
        id: 33,
        status: .init(name: .shipped),
        lineItems: [.init(trackingUrls: ["/track/me"])]
      )]
    }

    await OrderPrintJobCoordinator.sendTrackingEmails()

    let retrieved = try await Current.db.find(order.id)
    XCTAssertEqual(retrieved.printJobStatus, .shipped)
    XCTAssertEqual(sent.emails.count, 1)
    XCTAssertEqual(sent.emails.first?.to, "foo@bar.com")
    XCTAssert(sent.emails.first?.body.contains("/track/me") == true)
    XCTAssertEqual(sent.slacks, [.order("Order \(order.id.lowercased) shipped")])
  }

  func testOrderCanceledUpdatesOrderAndSlacks() async throws {
    _ = try await Current.db.query(Order.self).delete()
    try await Current.db.create(order)

    Current.luluClient.listPrintJobs = { _ in
      [.init(id: 33, status: .init(name: .canceled), lineItems: [])]
    }

    await OrderPrintJobCoordinator.sendTrackingEmails()

    let retrieved = try await Current.db.find(order.id)
    XCTAssertEqual(retrieved.printJobStatus, .canceled)
    XCTAssertEqual(sent.emails.count, 0)
    XCTAssertEqual(
      sent.slacks,
      [.error("Order \(order.id.lowercased) was found in status `CANCELED`!")]
    )
  }
}
