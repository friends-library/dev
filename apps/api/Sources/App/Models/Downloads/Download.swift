import DuetSQL

struct Download: Codable, Sendable {
  var id: Id
  var editionId: Edition.Id
  var format: Format
  var source: DownloadSource
  var audioQuality: AudioQuality?
  var audioPartNumber: Int?
  var isMobile: Bool
  var userAgent: String?
  var os: String?
  var browser: String?
  var platform: String?
  var referrer: String?
  var ip: String?
  var city: String?
  var region: String?
  var postalCode: String?
  var country: String?
  var latitude: String?
  var longitude: String?
  var createdAt = Current.date()

  var isValid: Bool { true }

  init(
    id: Id = .init(),
    editionId: Edition.Id,
    format: Format,
    source: DownloadSource,
    isMobile: Bool,
    audioQuality: AudioQuality? = nil,
    audioPartNumber: Int? = nil,
    userAgent: String? = nil,
    os: String? = nil,
    browser: String? = nil,
    platform: String? = nil,
    referrer: String? = nil,
    ip: String? = nil,
    city: String? = nil,
    region: String? = nil,
    postalCode: String? = nil,
    country: String? = nil,
    latitude: String? = nil,
    longitude: String? = nil
  ) {
    self.id = id
    self.editionId = editionId
    self.format = format
    self.source = source
    self.audioQuality = audioQuality
    self.audioPartNumber = audioPartNumber
    self.isMobile = isMobile
    self.userAgent = userAgent
    self.os = os
    self.browser = browser
    self.platform = platform
    self.referrer = referrer
    self.ip = ip
    self.city = city
    self.region = region
    self.postalCode = postalCode
    self.country = country
    self.latitude = latitude
    self.longitude = longitude
  }
}

// extensions

extension Download {
  enum AudioQuality: String, Codable, CaseIterable {
    case lq
    case hq
  }

  enum Format: String, Codable, CaseIterable {
    case epub
    case mobi
    case webPdf
    case mp3Zip
    case m4b
    case mp3
    case speech
    case podcast
    case appEbook
  }

  enum DownloadSource: String, Codable, CaseIterable {
    case website
    case podcast
    case app
  }
}

extension EditionType: PostgresEnum {
  var typeName: String {
    Download.M1.EditionTypeEnum.name
  }
}
