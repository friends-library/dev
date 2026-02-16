import Foundation
import XHttp

extension Lulu.Api.Client {
  @globalActor
  actor ReusableToken {
    static let shared = ReusableToken()

    private var token: (value: String, expiration: Date)?
    private var requestInFlight = false

    func get() async throws -> String {
      if let token, token.expiration > with(dependency: \.date.now) {
        return token.value
      } else if self.requestInFlight {
        try? await Task.sleep(nanoseconds: 150_000_000)
        return try await self.get()
      }
      self.requestInFlight = true
      defer { self.requestInFlight = false }
      let creds = try await HTTP.postFormUrlencoded(
        ["grant_type": "client_credentials"],
        to: "\(Env.LULU_API_ENDPOINT)/auth/realms/glasstree/protocol/openid-connect/token",
        decoding: Lulu.Api.CredentialsResponse.self,
        auth: .basic(Env.LULU_CLIENT_KEY, Env.LULU_CLIENT_SECRET),
        keyDecodingStrategy: .convertFromSnakeCase,
      )
      token = (
        value: creds.accessToken,
        expiration: with(dependency: \.date.now).addingTimeInterval(creds.expiresIn - 5.0),
      )
      return creds.accessToken
    }
  }
}
