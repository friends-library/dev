import Vapor

extension Request {
  var id: String {
    if let value = logger[metadataKey: "request-id"],
       let uuid = UUID(uuidString: "\(value)") {
      uuid.uuidString.lowercased()
    } else {
      UUID().uuidString.lowercased()
    }
  }

  var ipAddress: String? {
    let ip = headers.first(name: .xForwardedFor)
      ?? headers.first(name: "X-Real-IP")
      ?? remoteAddress?.ipAddress
    // sometimes we get multiple ip addresses, like `1.2.3.4, 1.2.3.5`
    return ip?.split(separator: ",").first.map { String($0) }
  }
}
