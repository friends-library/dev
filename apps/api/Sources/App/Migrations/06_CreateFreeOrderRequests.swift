import Fluent
import Vapor

struct CreateFreeOrderRequests: AsyncMigration {

  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: CreateFreeOrderRequests UP")
    try await database.schema(FreeOrderRequest.M6.tableName)
      .id()
      .field(FreeOrderRequest.M6.name, .string, .required)
      .field(FreeOrderRequest.M6.email, .string, .required)
      .field(FreeOrderRequest.M6.requestedBooks, .string, .required)
      .field(FreeOrderRequest.M6.aboutRequester, .string, .required)
      .field(FreeOrderRequest.M6.addressStreet, .string, .required)
      .field(FreeOrderRequest.M6.addressStreet2, .string)
      .field(FreeOrderRequest.M6.addressCity, .string, .required)
      .field(FreeOrderRequest.M6.addressState, .string, .required)
      .field(FreeOrderRequest.M6.addressZip, .string, .required)
      .field(FreeOrderRequest.M6.addressCountry, .string, .required)
      .field(FreeOrderRequest.M6.source, .string, .required)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .create()
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: CreateFreeOrderRequests DOWN")
    try await database.schema(FreeOrderRequest.M6.tableName).delete()
  }
}
