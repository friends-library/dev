import Foundation
import XHttp

enum IpApi {
  struct Response: Decodable, Equatable, Sendable {
    var ip: String?
    var city: String?
    var region: String?
    var countryName: String?
    var postal: String?
    var latitude: Double?
    var longitude: Double?

    init(
      ip: String? = nil,
      city: String? = nil,
      region: String? = nil,
      countryName: String? = nil,
      postal: String? = nil,
      latitude: Double? = nil,
      longitude: Double? = nil,
    ) {
      if let ip, !isRestricted(ip) {
        self.ip = ip
      }
      if let city, !isRestricted(city) {
        self.city = city
      }
      if let region, !isRestricted(region) {
        self.region = region
      }
      if let countryName, !isRestricted(countryName) {
        self.countryName = countryName
      }
      if let postal, !isRestricted(postal) {
        self.postal = postal
      }
      self.latitude = latitude
      self.longitude = longitude
    }
  }

  struct Client: Sendable {
    var getIpData = getIpData(ipAddress:)
  }
}

// implementation

@Sendable private func getIpData(ipAddress: String) async throws -> IpApi.Response {
  try await HTTP.get(
    "https://ipapi.co/\(ipAddress)/json/?key=\(Env.LOCATION_API_KEY)",
    decoding: IpApi.Response.self,
    keyDecodingStrategy: .convertFromSnakeCase,
  )
}

// helpers

private func isRestricted(_ string: String) -> Bool {
  string.lowercased().contains("sign up")
}

// mock extension

extension IpApi.Client {
  static let mock: Self = .init(getIpData: { .init(ip: $0) })
}
