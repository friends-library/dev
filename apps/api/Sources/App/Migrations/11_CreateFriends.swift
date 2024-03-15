import Fluent
import Vapor

struct CreateFriends: Migration {
  private typealias M11 = Friend.M11

  func prepare(on database: Database) -> Future<Void> {
    Current.logger.info("Running migration: CreateFriends UP")
    let genderFuture = database.enum(M11.GenderEnum.name)
      .case(M11.GenderEnum.caseMale)
      .case(M11.GenderEnum.caseFemale)
      .case(M11.GenderEnum.caseMixed)
      .create()

    let langFuture = database.enum(Order.M2.LangEnum.name).read()

    return genderFuture.and(langFuture).flatMap { enums -> Future<Void> in
      let (genders, langs) = enums
      return database.schema(M11.tableName)
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
  }

  func revert(on database: Database) -> Future<Void> {
    Current.logger.info("Running migration: CreateFriends DOWN")
    return database.schema(M11.tableName).delete()
  }
}
