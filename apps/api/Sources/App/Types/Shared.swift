import Foundation
import Tagged

enum Lang: String, Codable, CaseIterable, Sendable {
  case en
  case es
}

extension Lang {
  var locale: Locale {
    switch self {
    case .en:
      .init(identifier: "en_US")
    case .es:
      .init(identifier: "es_ES")
    }
  }

  var website: String {
    switch self {
    case .en:
      Env.WEBSITE_URL_EN
    case .es:
      Env.WEBSITE_URL_ES
    }
  }
}

enum EditionType: String, Codable, CaseIterable, Sendable {
  case updated
  case original
  case modernized
}

enum PrintSizeVariant: String, Codable, CaseIterable, Sendable {
  case s
  case m
  case xl
  case xlCondensed

  var printSize: PrintSize {
    switch self {
    case .s:
      .s
    case .m:
      .m
    case .xl, .xlCondensed:
      .xl
    }
  }
}

enum PrintSize: String, Codable, CaseIterable, Sendable {
  case s
  case m
  case xl
}

typealias GitCommitSha = Tagged<(tagged: (), sha: ()), String>
typealias ISBN = Tagged<(tagged: (), isbn: ()), String>
typealias Bytes = Tagged<(tagged: (), bytes: ()), Int>
typealias EmailAddress = Tagged<(tagged: (), emailAddress: ()), String>
