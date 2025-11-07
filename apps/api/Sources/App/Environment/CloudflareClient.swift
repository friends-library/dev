import Foundation
import XHttp

#if canImport(FoundationNetworking)
  import FoundationNetworking
#endif

struct CloudflareClient: Sendable {
  var verifyTurnstileToken: @Sendable (_ token: String) async -> TurnstileResult
}

extension CloudflareClient {
  static var live: CloudflareClient {
    .init(verifyTurnstileToken: { token in
      do {
        let response = try await HTTP.postFormUrlencoded(
          ["secret": Env.CLOUDFLARE_SECRET, "response": token],
          to: "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          decoding: VerifyResponse.self,
        )
        if response.success {
          return .success
        } else {
          return .failure(errorCodes: response.errorCodes, messages: response.messages)
        }
      } catch {
        return .error(error)
      }
    })
  }
}

extension CloudflareClient {
  static var test: CloudflareClient {
    .init(verifyTurnstileToken: { _ in
      fatalError("CloudflareClient.verifyTurnstileToken() non-overridden test")
    })
  }
}

enum TurnstileResult {
  case success
  case failure(errorCodes: [String], messages: [String]?)
  case error(any Error)
}

struct VerifyResponse: Decodable {
  var success: Bool
  var hostname: String?
  var messages: [String]?
  var errorCodes: [String]

  enum CodingKeys: String, CodingKey {
    case success
    case hostname
    case messages
    case errorCodes = "error-codes"
  }
}
