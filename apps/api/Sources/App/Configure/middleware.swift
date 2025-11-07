import Fluent
import Vapor

extension Configure {
  static func middleware(_ app: Application) {
    app.middleware = .init()
    app.middleware.use(corsMiddleware(app), at: .beginning)
    app.middleware.use(ErrorMiddleware.default(environment: app.environment))
  }
}

private func corsMiddleware(_ app: Application) -> CORSMiddleware {
  let corsConfiguration = CORSMiddleware.Configuration(
    allowedOrigin: Env.mode == .prod
      ? .any([
        "https://admin.friendslibrary.com",
        "https://www.friendslibrary.com",
        "https://www.bibliotecadelosamigos.org",
      ]) : .all,
    allowedMethods: [.GET, .POST, .OPTIONS],
    allowedHeaders: [
      .accept,
      .authorization,
      .contentType,
      .origin,
      .xRequestedWith,
      .userAgent,
      .accessControlAllowOrigin,
      .referer,
    ],
  )
  return CORSMiddleware(configuration: corsConfiguration)
}
