import Foundation
import XExpect

@testable import App

final class FreeOrderRequestTests: AppTestCase, @unchecked Sendable {
  func testCreateFreeOrderRequestPersistsAndEmailsRecipientTaxId() async throws {
    setenv("FREE_ORDER_REQUEST_EMAIL_RECIPIENT", "brother@example.com", 1)

    let input = CreateFreeOrderRequest.Input(
      name: "Pablo Smith",
      email: "pablo@example.com",
      requestedBooks: "Libro Uno",
      aboutRequester: "Quiero leerlos",
      addressStreet: "Calle 123",
      addressStreet2: nil,
      addressCity: "Lima",
      addressState: "Lima",
      addressZip: "15001",
      addressCountry: "PE",
      recipientTaxId: "12345678901",
      source: "https://bibliotecadelosamigos.org/libro",
    )

    let output = try await CreateFreeOrderRequest.resolve(with: input, in: .mock)

    expect(output).toEqual(.success)

    let request = try await FreeOrderRequest.query().first(in: self.db)
    expect(request.recipientTaxId).toEqual("12345678901")

    expect(self.sent.emails.count).toEqual(1)
    expect(self.sent.emails[0].to).toEqual("brother@example.com")
    expect(self.sent.emails[0].body).toContain("Recipient Tax ID")
    expect(self.sent.emails[0].body).toContain("12345678901")
  }

  func testGetFreeOrderRequestIncludesRecipientTaxIdInAddress() async throws {
    var request = FreeOrderRequest.mock
    request.addressCountry = "AR"
    request.recipientTaxId = "30-70737344-6"
    let created = try await self.db.create(request)

    let output = try await GetFreeOrderRequest.resolve(with: created.id, in: .authed)

    expect(output.email).toEqual(created.email)
    expect(output.address.recipientTaxId).toEqual("30-70737344-6")
    expect(output.address.country).toEqual("AR")
  }
}
