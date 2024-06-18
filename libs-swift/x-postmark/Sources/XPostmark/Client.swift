import Foundation
import XHttp

#if canImport(FoundationNetworking)
  import FoundationNetworking
#endif

public struct Client: Sendable {
  public var send: @Sendable (Email) async -> Result<Void, Client.Error>

  public init(send: @escaping @Sendable (Email) async -> Result<Void, Client.Error>) {
    self.send = send
  }
}

public struct Email {
  public var to: String
  public var from: String
  public var replyTo: String?
  public var subject: String

  /// invariant: one of these is always set
  public private(set) var htmlBody: String?
  public private(set) var textBody: String?

  public var body: String {
    htmlBody ?? textBody ?? ""
  }

  public init(
    to: String,
    from: String,
    replyTo: String? = nil,
    subject: String,
    textBody: String,
    htmlBody: String? = nil
  ) {
    self.to = to
    self.from = from
    self.replyTo = replyTo
    self.subject = subject
    self.textBody = textBody
    self.htmlBody = htmlBody
  }

  public init(
    to: String,
    from: String,
    replyTo: String? = nil,
    subject: String,
    htmlBody: String,
    textBody: String? = nil
  ) {
    self.to = to
    self.from = from
    self.replyTo = replyTo
    self.subject = subject
    self.htmlBody = htmlBody
    self.textBody = textBody
  }
}

// extensions

public extension Client {
  struct Error: Swift.Error, Encodable {
    public let statusCode: Int
    public let errorCode: Int
    public let message: String
  }

  static func live(apiKey: String) -> Self {
    Client(send: { email in
      do {
        let (data, urlResponse) = try await HTTP.postJson(
          ApiEmail(email: email),
          to: "https://api.postmarkapp.com/email",
          headers: [
            "Accept": "application/json",
            "X-Postmark-Server-Token": apiKey,
          ]
        )
        if urlResponse.statusCode == 200 {
          return .success(())
        }

        let response: ApiResponse
        do {
          response = try JSONDecoder().decode(ApiResponse.self, from: data)
        } catch {
          return .failure(Error(
            statusCode: urlResponse.statusCode,
            errorCode: -1,
            message: "Error decoding Postmark response: \(error)"
          ))
        }
        return .failure(Error(
          statusCode: urlResponse.statusCode,
          errorCode: response.ErrorCode,
          message: response.Message
        ))
      } catch {
        return .failure(Error(
          statusCode: -2,
          errorCode: -2,
          message: "Error sending Postmark email: \(error)"
        ))
      }
    })
  }
}

public extension Client {
  static let mock: Self = .init(send: { _ in .success(()) })
}

// api types

struct ApiEmail: Encodable {
  let From: String
  let To: String
  let Subject: String
  let HtmlBody: String?
  let TextBody: String?
  let ReplyTo: String?
  let TrackOpens: Bool

  init(email: Email) {
    From = email.from
    To = email.to
    Subject = email.subject
    HtmlBody = email.htmlBody
    TextBody = email.textBody
    ReplyTo = email.replyTo
    TrackOpens = true
  }
}

struct ApiResponse: Decodable {
  let ErrorCode: Int
  let Message: String
}
