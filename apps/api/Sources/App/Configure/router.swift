import Vapor

public extension Configure {
  static func router(_ app: Application) throws {
    LegacyRest.addRoutes(app)

    app.get(
      "download", "**",
      use: DownloadRoute.handler(_:)
    )

    app.get(
      "codegen", ":domain",
      use: CodegenRoute.handler(_:)
    )

    app.get(
      "confirm-email", ":language", ":token",
      use: ConfirmEmailRoute.handler(_:)
    )

    app.get(
      "unsubscribe", ":language", ":id",
      use: UnsubscribeRoute.handler(_:)
    )

    app.on(
      .POST,
      "pairql", ":domain", ":operation",
      body: .collect(maxSize: "512kb"),
      use: PairQLRoute.handler(_:)
    )
  }
}

protocol RouteHandler {
  @Sendable static func handler(_ request: Request) async throws -> Response
}

// helpers

func redirect(reason: ReasonToRedirect, success: Bool, lang: Lang) -> Response {
  .init(
    status: .temporaryRedirect,
    headers: .init([(
      "Location",
      "\(lang == .en ? Env.WEBSITE_URL_EN : Env.WEBSITE_URL_ES)/\(lang == .en ? "narrow-path" : "el-camino-estrecho")?result=\(success ? "success" : "failure")&action=\(reason == .emailConfirmation ? "emailConfirmation" : "unsubscribe")"
    )])
  )
}

enum ReasonToRedirect {
  case emailConfirmation
  case unsubscribe
}
