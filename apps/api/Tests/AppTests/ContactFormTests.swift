import XCTVapor
import XExpect

@testable import App

final class ContactFormTests: AppTestCase, @unchecked Sendable {
  func testSubmitContactFormEnglish() async throws {
    Current.date = { Date(timeIntervalSinceReferenceDate: 0) }
    Current.cloudflareClient.verifyTurnstileToken = { _ in .success }

    let output = try await SubmitContactForm.resolve(
      with: .init(
        lang: .en,
        name: "Bob Villa",
        email: "bob@thisoldhouse.com",
        subject: .tech,
        message: "hey there",
        turnstileToken: "not-real",
      ),
      in: .mock,
    )

    expect(output).toEqual(.success)
    let email = sent.emails.first
    XCTAssertEqual(sent.emails.count, 1)
    XCTAssertEqual(email?.subject, "friendslibrary.com contact form -- \(Current.date())")
    XCTAssertEqual(email?.replyTo, "bob@thisoldhouse.com")
    XCTAssertEqual(email?.from, "Friends Library <info@friendslibrary.com>")
    XCTAssertContains(email?.body, "Name: Bob Villa")
    XCTAssertContains(email?.body, "Message: hey there")
    XCTAssertContains(email?.body, "Type: Website / technical question")
    XCTAssertEqual(email?.to, Env.JARED_CONTACT_FORM_EMAIL)
    XCTAssertEqual(sent.slacks.count, 1)
    XCTAssertTrue(sent.slacks.first?.message.text.hasPrefix("*Contact form submission:*") == true)
  }

  func testSubmitContactFormSpanish() async throws {
    Current.date = { Date(timeIntervalSinceReferenceDate: 0) }
    Current.cloudflareClient.verifyTurnstileToken = { _ in .success }

    _ = try await SubmitContactForm.resolve(
      with: .init(
        lang: .es,
        name: "Pablo Smith",
        email: "pablo@mexico.gov",
        subject: .other,
        message: "hola",
        turnstileToken: "not-real",
      ),
      in: .mock,
    )

    let email = sent.emails.first
    XCTAssertEqual(sent.emails.count, 1)
    XCTAssertEqual(
      email?.subject,
      "bibliotecadelosamigos.org formulario de contacto -- \(Current.date())",
    )
    XCTAssertEqual(email?.replyTo, "pablo@mexico.gov")
    XCTAssertEqual(email?.from, "Biblioteca de los Amigos <info@bibliotecadelosamigos.org>")
    XCTAssertContains(email?.body, "Name: Pablo Smith")
    XCTAssertContains(email?.body, "Message: hola")
    XCTAssertEqual(email?.to, Env.JASON_CONTACT_FORM_EMAIL)
    XCTAssertEqual(sent.slacks.count, 1)
    XCTAssertTrue(sent.slacks.first?.message.text.hasPrefix("*Contact form submission:*") == true)
  }

  func testSubmitContactFormRejectedTurnstileToken() async throws {
    Current.cloudflareClient.verifyTurnstileToken = { _ in
      .failure(errorCodes: [], messages: nil)
    }

    try await expectErrorFrom {
      try await SubmitContactForm.resolve(
        with: .init(
          lang: .en,
          name: "Spammy McSpamface",
          email: "spam@example.com",
          subject: .tech,
          message: "Buy my product!",
          turnstileToken: "bad-token",
        ),
        in: .mock,
      )
    }.toContain("Bad Request")

    XCTAssertEqual(sent.emails.count, 0)
    XCTAssertEqual(sent.slacks.count, 1)
    XCTAssertContains(sent.slacks.first?.message.text, "Turnstile token rejected")
    XCTAssertContains(sent.slacks.first?.message.text, "spam@example.com")
  }
}
