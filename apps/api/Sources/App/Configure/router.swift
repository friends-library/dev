import Vapor

public extension Configure {
  static func router(_ app: Application) throws {
    LegacyRest.addRoutes(app)

    app.get(
      "download", "**",
      use: DownloadRoute.handler(_:),
    )

    app.get(
      "codegen", ":domain",
      use: CodegenRoute.handler(_:),
    )

    app.get(
      "confirm-email", ":language", ":token",
      use: ConfirmEmailRoute.handler(_:),
    )

    app.post(
      "postmark", "webhook", .constant(Env.POSTMARK_WEBHOOK_SLUG),
      use: PostmarkWebhookRoute.handler(_:),
    )

    app.get(
      "np-resubscribe", ":id",
      use: NPResubscribeRoute.handler(_:),
    )

    app.on(
      .POST,
      "pairql", ":domain", ":operation",
      body: .collect(maxSize: "512kb"),
      use: PairQLRoute.handler(_:),
    )
  }
}

protocol RouteHandler: Sendable {
  @Sendable static func handler(_ request: Request) async throws -> Response
}
