import Foundation
import XHttp

public extension SendGrid {
  struct Client: Sendable {
    public init(send: @Sendable @escaping (SendGrid.Email, String) async throws -> Data?) {
      self.send = send
    }

    public var send = send(email:apiKey:)
  }
}

@Sendable private func send(email: SendGrid.Email, apiKey: String) async throws -> Data? {
  let (data, response) = try await HTTP.postJson(
    email,
    to: "https://api.sendgrid.com/v3/mail/send",
    auth: .bearer(apiKey),
    keyEncodingStrategy: .convertToSnakeCase
  )
  return response.statusCode == 202 ? nil : data
}

// extensions

public extension SendGrid.Client {
  static let live: Self = .init(send: send(email:apiKey:))
  static let mock: Self = .init(send: { _, _ in nil })
}
