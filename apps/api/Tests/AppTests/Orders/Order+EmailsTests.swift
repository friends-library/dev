import Duet
import Foundation
import XCTest
import XExpect

@testable import App

final class OrderEmailsTests: AppTestCase {
  func mockOrder(lang: Lang) async -> (Order, String) {
    var order = Order.empty
    order.lang = lang
    order.email = "foo@bar.com"
    order.addressName = "Bob Villa"
    let entities = await Entities.create()
    var item = OrderItem.mock
    item.quantity = 1
    item.orderId = order.id
    item.editionId = entities.edition.id
    try! await order.create()
    try! await item.create()
    return (order, entities.document.title)
  }

  func testEnglishShippedEmail() async throws {
    let (order, docTitle) = await mockOrder(lang: .en)
    let email = try await EmailBuilder.orderShipped(order, trackingUrl: "/track/123")

    XCTAssertEqual(email.from, "Friends Library <info@friendslibrary.com>")
    XCTAssertEqual("[,] Friends Library Order Shipped", email.subject)
    XCTAssertTrue(email.body.hasPrefix("Bob,"))
    XCTAssertTrue(email.body.contains("(\(order.id.lowercased))"))
    expect(email.body).toContain("* (1) \(docTitle)")
    XCTAssertTrue(email.body.contains("/track/123"))
  }

  func testSpanishShippedEmail() async throws {
    let (order, docTitle) = await mockOrder(lang: .es)
    let email = try await EmailBuilder.orderShipped(order, trackingUrl: "/track/123")

    XCTAssertEqual(email.from, "Biblioteca de los Amigos <info@bibliotecadelosamigos.org>")
    XCTAssertEqual("[,] Pedido Enviado – Biblioteca de Amigos", email.subject)
    XCTAssertTrue(email.body.hasPrefix("Bob,"))
    XCTAssertTrue(email.body.contains("(\(order.id.lowercased))"))
    XCTAssertTrue(email.body.contains("* (1) \(docTitle)"))
    XCTAssertTrue(email.body.contains("/track/123"))
  }

  func testFallbacks() async throws {
    var (enOrder, _) = await mockOrder(lang: .en)
    enOrder.addressName = ""
    var (esOrder, _) = await mockOrder(lang: .es)
    esOrder.addressName = ""
    let enEmail = try await EmailBuilder.orderShipped(enOrder, trackingUrl: nil)
    let esEmail = try await EmailBuilder.orderShipped(esOrder, trackingUrl: nil)
    XCTAssertTrue(enEmail.body.hasPrefix("Hello!"))
    XCTAssertTrue(esEmail.body.hasPrefix("¡Hola!"))
    XCTAssertTrue(enEmail.body.contains("(Sorry, not available)"))
    XCTAssertTrue(esEmail.body.contains("(Lo sentimos, no disponible)"))
  }
}
