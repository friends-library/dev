import Duet
import Foundation
import XCTest

@testable import App

final class OrderEmailsTests: AppTestCase {

  func mockOrder(lang: Lang) async -> (Order, String) {
    let order = Order.random
    order.lang = lang
    order.email = "foo@bar.com"
    order.addressName = "Bob Villa"
    let entities = await Entities.create()
    let item = OrderItem.mock
    item.quantity = 1
    item.orderId = order.id
    item.editionId = entities.edition.id
    connect(order, \.items, to: [item], \.order)
    return (order, entities.document.title)
  }

  func testEnglishShippedEmail() async throws {
    let (order, docTitle) = await mockOrder(lang: .en)
    let email = try await EmailBuilder.orderShipped(order, trackingUrl: "/track/123")

    XCTAssertEqual(email.from, .init(email: "noreply@friendslibrary.com", name: "Friends Library"))
    XCTAssertEqual("[,] Friends Library Order Shipped", email.subject)
    XCTAssertTrue(email.text.hasPrefix("Bob,"))
    XCTAssertTrue(email.text.contains("(\(order.id.lowercased))"))
    XCTAssertTrue(email.text.contains("* (1) \(docTitle)"))
    XCTAssertTrue(email.text.contains("/track/123"))
  }

  func testSpanishShippedEmail() async throws {
    let (order, docTitle) = await mockOrder(lang: .es)
    let email = try await EmailBuilder.orderShipped(order, trackingUrl: "/track/123")

    XCTAssertEqual(
      email.from,
      .init(email: "noreply@bibliotecadelosamigos.org", name: "Biblioteca de los Amigos")
    )
    XCTAssertEqual("[,] Pedido Enviado – Biblioteca de Amigos", email.subject)
    XCTAssertTrue(email.text.hasPrefix("Bob,"))
    XCTAssertTrue(email.text.contains("(\(order.id.lowercased))"))
    XCTAssertTrue(email.text.contains("* (1) \(docTitle)"))
    XCTAssertTrue(email.text.contains("/track/123"))
  }

  func testFallbacks() async throws {
    let (enOrder, _) = await mockOrder(lang: .en)
    enOrder.addressName = ""
    let (esOrder, _) = await mockOrder(lang: .es)
    esOrder.addressName = ""
    let enEmail = try await EmailBuilder.orderShipped(enOrder, trackingUrl: nil)
    let esEmail = try await EmailBuilder.orderShipped(esOrder, trackingUrl: nil)
    XCTAssertTrue(enEmail.text.hasPrefix("Hello!"))
    XCTAssertTrue(esEmail.text.hasPrefix("¡Hola!"))
    XCTAssertTrue(enEmail.text.contains("<em>Sorry, not available</em>"))
    XCTAssertTrue(esEmail.text.contains("<em>Lo sentimos, no disponible</em>"))
  }
}
