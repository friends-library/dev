import Fluent

struct CreateEditionImpressions: AsyncMigration {
  private typealias M18 = EditionImpression.M18

  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: CreateEditionImpressions UP")
    let printSizeVariants = try await database.enum(Edition.M17.PrintSizeVariantEnum.name)
      .read()
    try await database.schema(M18.tableName)
      .id()
      .field(
        M18.editionId,
        .uuid,
        .references(Edition.M17.tableName, .id, onDelete: .cascade),
        .required,
      )
      .field(M18.adocLength, .int, .required)
      .field(M18.paperbackSizeVariant, printSizeVariants, .required)
      .field(M18.paperbackVolumes, .array(of: .int), .required)
      .field(M18.publishedRevision, .string, .required)
      .field(M18.productionToolchainRevision, .string, .required)
      .field(.createdAt, .datetime, .required)
      .unique(on: M18.editionId)
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: CreateEditionImpressions DOWN")
    try await database.schema(M18.tableName).delete()
  }
}

extension EditionImpression {
  enum M18 {
    static let tableName = "edition_impressions"
    static let editionId = FieldKey("edition_id")
    static let adocLength = FieldKey("adoc_length")
    static let publishedRevision = FieldKey("published_revision")
    static let productionToolchainRevision = FieldKey("production_toolchain_revision")
    static let paperbackSizeVariant = FieldKey("paperback_size_variant")
    static let paperbackVolumes = FieldKey("paperback_volumes")
  }
}
