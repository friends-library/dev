import Foundation
import XHttp

#if os(Linux)
  extension JSONDecoder.KeyDecodingStrategy: @unchecked Sendable {}
#endif

extension Lulu.Api.Client {
  actor ReusableToken {
    var token: (value: String, expiration: Date)?

    func get() async throws -> String {
      if let token = token, token.expiration > Current.date() {
        return token.value
      }
      let creds = try await HTTP.postFormUrlencoded(
        ["grant_type": "client_credentials"],
        to: "\(Env.LULU_API_ENDPOINT)/auth/realms/glasstree/protocol/openid-connect/token",
        decoding: Lulu.Api.CredentialsResponse.self,
        auth: .basic(Env.LULU_CLIENT_KEY, Env.LULU_CLIENT_SECRET),
        keyDecodingStrategy: .convertFromSnakeCase
      )
      token = (
        value: creds.accessToken,
        expiration: Date().addingTimeInterval(creds.expiresIn)
      )
      return creds.accessToken
    }
  }
}

let luluToken = Lulu.Api.Client.ReusableToken()
