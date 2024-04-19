import Foundation

struct UserAgentDeviceData: Decodable, Sendable {
  let isBot: Bool
  let isMobile: Bool
  let os: String
  let browser: String
  let platform: String
}

extension UserAgentDeviceData {
  init?(userAgent: String) {
    let parse = Process()
    parse.executableURL = URL(fileURLWithPath: Env.NODE_BIN)
    parse.arguments = [Env.PARSE_USERAGENT_BIN, userAgent]
    let outPipe = Pipe()
    parse.standardOutput = outPipe
    try? parse.run()
    let data = outPipe.fileHandleForReading.readDataToEndOfFile()
    guard let decoded = try? JSONDecoder().decode(Self.self, from: data) else {
      return nil
    }
    self = decoded
  }
}
