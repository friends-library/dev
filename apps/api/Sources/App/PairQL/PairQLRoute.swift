import PairQL
import Rainbow
import Vapor
import VaporRouting

enum PairQLRoute: RouteHandler, RouteResponder, Equatable {
  case dev(DevRoute)
  case admin(AdminRoute)
  case order(OrderRoute)
  case evans(EvansRoute)
  case evansBuild(EvansBuildRoute)
  case native(NativeRoute)

  static func respond(to route: Self, in context: Context) async throws -> Response {
    switch route {
    case .dev(let devRoute):
      return try await DevRoute.respond(to: devRoute, in: context)
    case .admin(let adminRoute):
      return try await AdminRoute.respond(to: adminRoute, in: context)
    case .order(let orderRoute):
      return try await OrderRoute.respond(to: orderRoute, in: context)
    case .evans(let evansRoute):
      return try await EvansRoute.respond(to: evansRoute, in: context)
    case .evansBuild(let evansBuildRoute):
      return try await EvansBuildRoute.respond(to: evansBuildRoute, in: context)
    case .native(let nativeRoute):
      return try await NativeRoute.respond(to: nativeRoute, in: context)
    }
  }

  nonisolated(unsafe) static let router = OneOf {
    Route(.case(PairQLRoute.dev)) {
      Method.post
      Path { "dev" }
      DevRoute.router
    }
    Route(.case(PairQLRoute.admin)) {
      Method.post
      Path { "admin" }
      AdminRoute.router
    }
    Route(.case(PairQLRoute.order)) {
      Method.post
      Path { "order" }
      OrderRoute.router
    }
    Route(.case(PairQLRoute.evans)) {
      Method.post
      Path { "evans" }
      EvansRoute.router
    }
    Route(.case(PairQLRoute.evansBuild)) {
      Method.post
      Path { "evans-build" }
      EvansBuildRoute.router
    }
    Route(.case(PairQLRoute.native)) {
      Method.post
      Path { "native" }
      NativeRoute.router
    }
  }.eraseToAnyParserPrinter()

  static func handler(_ request: Request) async throws -> Response {
    guard var requestData = URLRequestData(request: request),
          requestData.path.removeFirst() == "pairql" else {
      throw Abort(.badRequest)
    }

    let context = Context(requestId: request.id)
    do {
      let route = try PairQLRoute.router.parse(requestData)
      let start = Date()
      let output = try await PairQLRoute.respond(to: route, in: context)
      logOperation(route, request, Date().timeIntervalSince(start))
      return output
    } catch {
      if "\(type(of: error))" == "ParsingError" {
        if Env.mode == .dev { print("PairQL routing \(error)") }
        return .init(PqlError(
          id: "0f5a25c9",
          requestId: context.requestId,
          type: .notFound,
          detail: Env.mode == .dev ? "PairQL routing \(error)" : "PairQL route not found"
        ))
      } else if let pqlError = error as? PqlError {
        return .init(pqlError)
      } else if let convertible = error as? PqlErrorConvertible {
        return .init(convertible.pqlError(in: context))
      } else {
        print(type(of: error), error)
        throw error
      }
    }
  }
}

// helpers

private func logOperation(_ route: PairQLRoute, _ request: Request, _ duration: TimeInterval) {
  let operation = "\(request.parameters.get("operation") ?? "")".yellow
  var elapsed = ""
  switch duration {
  case 0.0 ..< 1.0:
    elapsed = "(\(Int(duration * 1000)) ms)".dim
  default:
    elapsed = "(\(String(format: "%.2f", duration)) sec)".red
  }
  switch route {
  case .dev:
    Current.logger
      .notice("PairQL request: \("Dev".magenta) \(operation) \(elapsed)")
  case .admin:
    Current.logger
      .notice("PairQL request: \("Admin".cyan) \(operation) \(elapsed)")
  case .order:
    Current.logger
      .notice("PairQL request: \("Order".red) \(operation) \(elapsed)")
  case .evans:
    Current.logger
      .notice("PairQL request: \("Evans".lightBlue) \(operation) \(elapsed)")
  case .evansBuild:
    Current.logger
      .notice("PairQL request: \("EvansBuild".green) \(operation) \(elapsed)")
  case .native:
    Current.logger
      .notice("PairQL request: \("Native".lightGreen) \(operation) \(elapsed)")
  }
}
