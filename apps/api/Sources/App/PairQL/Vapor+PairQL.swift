import PairQL
import Vapor

extension RouteResponder where Response == Vapor.Response {
  static func respond(with output: some PairOutput) throws -> Response {
    try output.response()
  }
}

extension PairOutput {
  func response() throws -> Response {
    try Response(
      status: .ok,
      headers: ["Content-Type": "application/json"],
      body: .init(data: jsonData())
    )
  }
}
