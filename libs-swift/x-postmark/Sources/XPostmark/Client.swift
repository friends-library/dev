import Foundation
import XHttp

public struct Client: Sendable {
  public var sendEmail: @Sendable (Email) async -> Result<Void, Client.Error>
  public var sendTemplateEmail: @Sendable (TemplateEmail) async -> Result<Void, Client.Error>
  public var sendTemplateEmailBatch: @Sendable ([TemplateEmail]) async
    -> Result<[Result<Void, Client.BatchEmail.Error>], Client.Error>
  public var deleteSuppression: @Sendable (String, String) async -> Result<Void, Client.Error>

  public init(
    sendEmail: @escaping @Sendable (Email) async -> Result<Void, Client.Error>,
    sendTemplateEmail: @escaping @Sendable (TemplateEmail) async -> Result<Void, Client.Error>,
    sendTemplateEmailBatch: @escaping @Sendable ([TemplateEmail]) async
      -> Result<[Result<Void, Client.BatchEmail.Error>], Client.Error>,
    deleteSuppression: @escaping @Sendable (String, String) async -> Result<Void, Client.Error>
  ) {
    self.sendEmail = sendEmail
    self.sendTemplateEmail = sendTemplateEmail
    self.sendTemplateEmailBatch = sendTemplateEmailBatch
    self.deleteSuppression = deleteSuppression
  }
}

// extensions

public extension Client {
  enum BatchEmail {
    public struct Error: Swift.Error, Encodable {
      public var errorCode: Int
      public var message: String
    }
  }

  struct Error: Swift.Error, Encodable {
    public let statusCode: Int
    public let errorCode: Int
    public let message: String
  }

  static func live(apiKey: String) -> Self {
    Client(
      sendEmail: { email in
        await sendSingle(.email(email), apiKey)
      },
      sendTemplateEmail: { email in
        await sendSingle(.template(email), apiKey)
      },
      sendTemplateEmailBatch: { email in
        await _sendTemplateEmailBatch(email, apiKey)
      },
      deleteSuppression: { emailAddress, streamId in
        await _deleteSuppression(emailAddress, streamId, apiKey)
      }
    )
  }
}

public extension Client {
  static let mock = Client(
    sendEmail: { _ in .success(()) },
    sendTemplateEmail: { _ in .success(()) },
    sendTemplateEmailBatch: { emails in .success([]) },
    deleteSuppression: { _, _ in .success(()) }
  )
}

// api types

struct SendEmailResponse: Decodable {
  let ErrorCode: Int
  let Message: String
}
