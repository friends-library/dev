import Foundation
import XCTest

@testable import App

final class SendTrackingEmailsTests: AppTestCase, @unchecked Sendable {
  var order = Order.mock

  override func setUp() {
    super.setUp()
    self.order = Order.mock
    self.order.email = "foo@bar.com"
    self.order.printJobStatus = .accepted
    self.order.printJobId = 33
  }

  func testCheckSendTrackingEmailsHappyPath() async throws {
    try await Current.db.delete(all: Order.self)
    try await Current.db.create(self.order)

    Current.luluClient.listPrintJobs = { ids in
      XCTAssertEqual(ids, .init(33))
      return [.init(
        id: 33,
        status: .init(name: .shipped),
        lineItems: [.init(trackingUrls: ["/track/me"])],
      )]
    }

    await OrderPrintJobCoordinator.sendTrackingEmails()

    let retrieved = try await Current.db.find(self.order.id)
    XCTAssertEqual(retrieved.printJobStatus, .shipped)
    XCTAssertEqual(sent.emails.count, 1)
    XCTAssertEqual(sent.emails.first?.to, "foo@bar.com")
    XCTAssert(sent.emails.first?.body.contains("/track/me") == true)
    XCTAssertEqual(sent.slacks, [.order("Order \(self.order.id.lowercased) shipped")])
  }

  func testOrderCanceledUpdatesOrderAndSlacks() async throws {
    _ = try await Current.db.query(Order.self).delete(in: Current.db)
    try await Current.db.create(self.order)

    Current.luluClient.listPrintJobs = { _ in
      [.init(id: 33, status: .init(name: .canceled), lineItems: [])]
    }

    await OrderPrintJobCoordinator.sendTrackingEmails()

    let retrieved = try await Current.db.find(self.order.id)
    XCTAssertEqual(retrieved.printJobStatus, .canceled)
    XCTAssertEqual(sent.emails.count, 1)
    XCTAssert(sent.emails[0].subject.contains("Print job error"))
    XCTAssertEqual(sent.emails[0].to, Env.JARED_CONTACT_FORM_EMAIL)
    XCTAssertEqual(
      sent.slacks,
      [.error("Order \(self.order.id.lowercased) was found in status `CANCELED`!")],
    )
  }
}
