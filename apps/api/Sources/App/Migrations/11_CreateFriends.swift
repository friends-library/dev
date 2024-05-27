import Fluent
import Vapor

struct CreateFriends: AsyncMigration {
  private typealias M11 = Friend.M11

  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: CreateFriends UP")
    let genders = try await database.enum(M11.GenderEnum.name)
      .case(M11.GenderEnum.caseMale)
      .case(M11.GenderEnum.caseFemale)
      .case(M11.GenderEnum.caseMixed)
      .create()

    let langs = try await database.enum(Order.M2.LangEnum.name).read()

    try await database.schema(M11.tableName)
      .id()
      .field(M11.lang, langs, .required)
      .field(M11.name, .string, .required)
      .field(M11.slug, .string, .required)
      .field(M11.gender, genders, .required)
      .field(M11.description, .string, .required)
      .field(M11.born, .int)
      .field(M11.died, .int)
      .field(M11.published, .datetime)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .field(.deletedAt, .datetime)
      .unique(on: M11.lang, M11.slug)
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: CreateFriends DOWN")
    try await database.schema(M11.tableName).delete()
    try await database.enum(M11.GenderEnum.name).delete()
  }
}
