import DuetSQL
import FluentPostgresDriver
import Vapor

extension Configure {
  static func database(_ app: Application) {
    let dbPrefix = Env.mode == .test ? "TEST_" : ""
    app.databases.use(
      .postgres(
        hostname: Env.get("DATABASE_HOST") ?? "localhost",
        port: Env.get("DATABASE_PORT").flatMap(Int.init(_:))
          ?? PostgresConfiguration.ianaPortNumber,
        username: Env.DATABASE_USERNAME,
        password: Env.DATABASE_PASSWORD,
        database: Env.get("\(dbPrefix)DATABASE_NAME")!
      ),
      as: .psql
    )

    Current.db = LiveClient(sql: app.db as! SQLDatabase)
  }
}
