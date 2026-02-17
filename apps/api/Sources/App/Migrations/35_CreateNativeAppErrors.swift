import Fluent

struct CreateNativeAppErrors: AsyncMigration {
  private typealias M35 = NativeAppError.M35

  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: CreateNativeAppErrors UP")
    let lang = try await database.enum(Order.M2.LangEnum.name).read()
    try await database.schema(M35.tableName)
      .id()
      .field(M35.buildSemver, .string, .required)
      .field(M35.buildNumber, .int, .required)
      .field(M35.lang, lang, .required)
      .field(M35.detail, .string, .required)
      .field(M35.platform, .string, .required)
      .field(M35.installId, .string, .required)
      .field(M35.errorMessage, .string)
      .field(M35.errorStack, .string)
      .field(.createdAt, .datetime, .required)
      .create()
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: CreateNativeAppErrors DOWN")
    try await database.schema(M35.tableName).delete()
  }
}
