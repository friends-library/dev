import PairQL
import Vapor

enum NativeRoute: PairRoute {
  case reportError(ReportError.Input)

  nonisolated(unsafe) static let router = OneOf {
    Route(/Self.reportError) {
      Operation(ReportError.self)
      Body(.input(ReportError.self))
    }
  }
}

extension NativeRoute: RouteResponder {
  static func respond(to route: Self, in context: Context) async throws -> Response {
    switch route {
    case .reportError(let input):
      let output = try await ReportError.resolve(with: input, in: context)
      return try self.respond(with: output)
    }
  }
}
