import DuetSQL
import FluentSQL
import Vapor

struct PgEnumsToText: AsyncMigration {
  private struct Target {
    let type: String
    let values: [String]
    let columns: [(table: String, column: FieldKey)]
  }

  private var targets: [Target] {
    [
      Target(
        type: Download.M1.EditionTypeEnum.name,
        values: [
          Download.M1.EditionTypeEnum.caseUpdated,
          Download.M1.EditionTypeEnum.caseModernized,
          Download.M1.EditionTypeEnum.caseOriginal,
        ],
        columns: [
          // `downloads.edition_type` and `order_items.edition_type` were dropped in
          // migration 10 (HandleEditionIds) in favor of an `edition_id` FK, so
          // `editions.type` is the only surviving column on this enum type.
          (Edition.M17.tableName, Edition.M17.type),
        ],
      ),
      Target(
        type: Download.M1.AudioQualityEnum.name,
        values: [
          Download.M1.AudioQualityEnum.caseLq,
          Download.M1.AudioQualityEnum.caseHq,
        ],
        columns: [
          (Download.M1.tableName, Download.M1.audioQuality),
        ],
      ),
      Target(
        type: Download.M1.FormatEnum.name,
        values: [
          Download.M1.FormatEnum.caseEpub,
          Download.M1.FormatEnum.caseMobi,
          Download.M1.FormatEnum.caseWebPdf,
          Download.M1.FormatEnum.caseMp3Zip,
          Download.M1.FormatEnum.caseM4b,
          Download.M1.FormatEnum.caseMp3,
          Download.M1.FormatEnum.caseSpeech,
          Download.M1.FormatEnum.casePodcast,
          Download.M1.FormatEnum.caseAppEbook,
        ],
        columns: [
          (Download.M1.tableName, Download.M1.format),
        ],
      ),
      Target(
        type: Download.M1.SourceEnum.name,
        values: [
          Download.M1.SourceEnum.caseWebsite,
          Download.M1.SourceEnum.casePodcast,
          Download.M1.SourceEnum.caseApp,
        ],
        columns: [
          (Download.M1.tableName, Download.M1.source),
        ],
      ),
      Target(
        type: Order.M2.PrintJobStatusEnum.name,
        values: [
          Order.M2.PrintJobStatusEnum.casePresubmit,
          Order.M2.PrintJobStatusEnum.casePending,
          Order.M2.PrintJobStatusEnum.caseAccepted,
          Order.M2.PrintJobStatusEnum.caseRejected,
          Order.M2.PrintJobStatusEnum.caseShipped,
          Order.M2.PrintJobStatusEnum.caseCanceled,
          Order.M2.PrintJobStatusEnum.caseBricked,
        ],
        columns: [
          (Order.M2.tableName, Order.M2.printJobStatus),
        ],
      ),
      Target(
        type: Order.M2.ShippingLevelEnum.name,
        values: [
          Order.M2.ShippingLevelEnum.caseMail,
          Order.M2.ShippingLevelEnum.casePriorityMail,
          Order.M2.ShippingLevelEnum.caseGroundHd,
          Order.M2.ShippingLevelEnum.caseGround,
          Order.M2.ShippingLevelEnum.caseExpedited,
          Order.M2.ShippingLevelEnum.caseExpress,
          AddShippingLevelGroundBus.M16.ShippingLevelEnum.caseGroundBus,
        ],
        columns: [
          (Order.M2.tableName, Order.M2.shippingLevel),
        ],
      ),
      Target(
        type: Order.M2.LangEnum.name,
        values: [
          Order.M2.LangEnum.caseEn,
          Order.M2.LangEnum.caseEs,
        ],
        columns: [
          (Order.M2.tableName, Order.M2.lang),
          (Friend.M11.tableName, Friend.M11.lang),
          (NativeAppError.M35.tableName, NativeAppError.M35.lang),
          (NPSubscriber.M36.tableName, NPSubscriber.M36.lang),
          (NPQuote.M37.tableName, NPQuote.M37.lang),
        ],
      ),
      Target(
        type: Order.M2.SourceEnum.name,
        values: [
          Order.M2.SourceEnum.caseWebsite,
          Order.M2.SourceEnum.caseInternal,
        ],
        columns: [
          (Order.M2.tableName, Order.M2.source),
        ],
      ),
      Target(
        type: Friend.M11.GenderEnum.name,
        values: [
          Friend.M11.GenderEnum.caseMale,
          Friend.M11.GenderEnum.caseFemale,
          Friend.M11.GenderEnum.caseMixed,
        ],
        columns: [
          (Friend.M11.tableName, Friend.M11.gender),
        ],
      ),
      Target(
        type: TokenScope.M5.dbEnumName,
        values: [
          TokenScope.M5.Scope.queryDownloads,
          TokenScope.M5.Scope.mutateDownloads,
          TokenScope.M5.Scope.queryOrders,
          TokenScope.M5.Scope.mutateOrders,
          TokenScope.M9.Scope.mutateArtifactProductionVersions,
          TokenScope.M24.Scope.caseAll,
          TokenScope.M24.Scope.caseQueryArtifactProductionVersions,
          TokenScope.M24.Scope.caseQueryEntities,
          TokenScope.M24.Scope.caseMutateEntities,
          TokenScope.M24.Scope.caseQueryTokens,
          TokenScope.M24.Scope.caseMutateTokens,
        ],
        columns: [
          (TokenScope.M5.tableName, TokenScope.M5.scope),
        ],
      ),
      Target(
        type: Edition.M17.PrintSizeVariantEnum.name,
        values: [
          Edition.M17.PrintSizeVariantEnum.caseS,
          Edition.M17.PrintSizeVariantEnum.caseM,
          Edition.M17.PrintSizeVariantEnum.caseXl,
          Edition.M17.PrintSizeVariantEnum.caseXlCondensed,
        ],
        columns: [
          (Edition.M17.tableName, Edition.M17.paperbackOverrideSize),
          (EditionImpression.M18.tableName, EditionImpression.M18.paperbackSizeVariant),
        ],
      ),
      Target(
        type: DocumentTag.M15.DocumentTagEnum.name,
        values: [
          DocumentTag.M15.DocumentTagEnum.caseJournal,
          DocumentTag.M15.DocumentTagEnum.caseLetters,
          DocumentTag.M15.DocumentTagEnum.caseExhortation,
          DocumentTag.M15.DocumentTagEnum.caseDoctrinal,
          DocumentTag.M15.DocumentTagEnum.caseTreatise,
          DocumentTag.M15.DocumentTagEnum.caseHistory,
          DocumentTag.M15.DocumentTagEnum.caseAllegory,
          DocumentTag.M15.DocumentTagEnum.caseSpiritualLife,
        ],
        columns: [
          (DocumentTag.M15.tableName, DocumentTag.M15.type),
        ],
      ),
    ]
  }

  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: PgEnumsToText UP")
    let sql = database as! SQLDatabase
    for target in self.targets {
      for (table, column) in target.columns {
        let name = column.description
        try await sql.execute(
          """
          ALTER TABLE \(unsafeRaw: table)
          ALTER COLUMN "\(unsafeRaw: name)" TYPE text USING "\(unsafeRaw: name)"::text
          """,
        )
        try await sql.execute(
          """
          ALTER TABLE \(unsafeRaw: table)
          ADD CONSTRAINT \(unsafeRaw: Self.constraint(table, column))
          CHECK ("\(unsafeRaw: name)" IN (\(unsafeRaw: Self.valueList(target.values))))
          """,
        )
      }
      try await sql.execute("DROP TYPE \(unsafeRaw: target.type)")
    }
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: PgEnumsToText DOWN")
    let sql = database as! SQLDatabase
    for target in self.targets {
      try await sql.execute(
        """
        CREATE TYPE \(unsafeRaw: target.type) AS ENUM (\(unsafeRaw: Self.valueList(target.values)))
        """,
      )
      for (table, column) in target.columns {
        let name = column.description
        try await sql.execute(
          """
          ALTER TABLE \(unsafeRaw: table)
          DROP CONSTRAINT \(unsafeRaw: Self.constraint(table, column))
          """,
        )
        try await sql.execute(
          """
          ALTER TABLE \(unsafeRaw: table)
          ALTER COLUMN "\(unsafeRaw: name)" TYPE \(unsafeRaw: target.type)
          USING "\(unsafeRaw: name)"::\(unsafeRaw: target.type)
          """,
        )
      }
    }
  }

  private static func constraint(_ table: String, _ column: FieldKey) -> String {
    "chk_\(table)_\(column.description)"
  }

  private static func valueList(_ values: [String]) -> String {
    values.map { "'\($0)'" }.joined(separator: ", ")
  }
}
