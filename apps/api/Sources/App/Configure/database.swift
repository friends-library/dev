import FluentPostgresDriver
import Vapor

extension Configure {
  static func database(_ app: Application) {
    app.databases.use(.flpPostgres(testDb: Env.mode == .test), as: .psql)
  }
}

extension DatabaseConfigurationFactory {
  static func flpPostgres(testDb: Bool = false) -> DatabaseConfigurationFactory {
    let dbPrefix = testDb ? "TEST_" : ""
    return .postgres(configuration: .init(
      hostname: Env.get("DATABASE_HOST") ?? "localhost",
      username: Env.DATABASE_USERNAME,
      password: Env.DATABASE_PASSWORD,
      database: Env.get("\(dbPrefix)DATABASE_NAME")!,
      tls: .disable,
    ))
  }
}
