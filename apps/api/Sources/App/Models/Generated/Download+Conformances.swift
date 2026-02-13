// auto-generated, do not edit
import DuetSQL
import Tagged

extension Download: ApiModel {
  typealias Id = Tagged<Download, UUID>
}

extension Download: Model {
  static let tableName = M1.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .editionId:
      .uuid(editionId)
    case .format:
      .enum(format)
    case .source:
      .enum(source)
    case .audioQuality:
      .enum(audioQuality)
    case .audioPartNumber:
      .int(audioPartNumber)
    case .isMobile:
      .bool(isMobile)
    case .userAgent:
      .string(userAgent)
    case .os:
      .string(os)
    case .browser:
      .string(browser)
    case .platform:
      .string(platform)
    case .referrer:
      .string(referrer)
    case .ip:
      .string(ip)
    case .city:
      .string(city)
    case .region:
      .string(region)
    case .postalCode:
      .string(postalCode)
    case .country:
      .string(country)
    case .latitude:
      .string(latitude)
    case .longitude:
      .string(longitude)
    case .createdAt:
      .date(createdAt)
    }
  }
}

extension Download {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable, ModelColumns {
    case id
    case editionId
    case format
    case source
    case audioQuality
    case audioPartNumber
    case isMobile
    case userAgent
    case os
    case browser
    case platform
    case referrer
    case ip
    case city
    case region
    case postalCode
    case country
    case latitude
    case longitude
    case createdAt
  }
}

extension Download {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .editionId: .uuid(editionId),
      .format: .enum(format),
      .source: .enum(source),
      .audioQuality: .enum(audioQuality),
      .audioPartNumber: .int(audioPartNumber),
      .isMobile: .bool(isMobile),
      .userAgent: .string(userAgent),
      .os: .string(os),
      .browser: .string(browser),
      .platform: .string(platform),
      .referrer: .string(referrer),
      .ip: .string(ip),
      .city: .string(city),
      .region: .string(region),
      .postalCode: .string(postalCode),
      .country: .string(country),
      .latitude: .string(latitude),
      .longitude: .string(longitude),
      .createdAt: .currentTimestamp,
    ]
  }
}
