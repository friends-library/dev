import Foundation

struct UserAgentParser: Sendable {
  var parse: @Sendable (String) -> UserAgentDeviceData?
}

extension UserAgentParser {
  static let live = Self { .init(userAgent: $0) }
  static let `nil` = Self { _ in nil }
  static let mock = Self { ua in
    if ua.contains("GoogleBot") {
      .init(
        isBot: true,
        isMobile: false,
        os: "botOS 3.3",
        browser: "bot 3.3",
        platform: "bot",
      )
    } else {
      .init(
        isBot: false,
        isMobile: false,
        os: "Windows 10.0",
        browser: "Chrome",
        platform: "Windows",
      )
    }
  }
}
