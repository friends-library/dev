import Fluent

struct CreateOrders: AsyncMigration {
  private typealias M2 = Order.M2

  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: CreateOrders UP")
    let printJobStatus = try await database.enum(M2.PrintJobStatusEnum.name)
      .case(M2.PrintJobStatusEnum.casePresubmit)
      .case(M2.PrintJobStatusEnum.casePending)
      .case(M2.PrintJobStatusEnum.caseAccepted)
      .case(M2.PrintJobStatusEnum.caseRejected)
      .case(M2.PrintJobStatusEnum.caseShipped)
      .case(M2.PrintJobStatusEnum.caseCanceled)
      .case(M2.PrintJobStatusEnum.caseBricked)
      .create()

    let shippingLevel = try await database.enum(M2.ShippingLevelEnum.name)
      .case(M2.ShippingLevelEnum.caseMail)
      .case(M2.ShippingLevelEnum.casePriorityMail)
      .case(M2.ShippingLevelEnum.caseGroundHd)
      .case(M2.ShippingLevelEnum.caseGround)
      .case(M2.ShippingLevelEnum.caseExpedited)
      .case(M2.ShippingLevelEnum.caseExpress)
      .create()

    let lang = try await database.enum(M2.LangEnum.name)
      .case(M2.LangEnum.caseEn)
      .case(M2.LangEnum.caseEs)
      .create()

    let source = try await database.enum(M2.SourceEnum.name)
      .case(M2.SourceEnum.caseWebsite)
      .case(M2.SourceEnum.caseInternal)
      .create()

    try await database.schema(M2.tableName)
      .id()
      .field(M2.paymentId, .string, .required)
      .field(M2.printJobStatus, printJobStatus, .required)
      .field(M2.printJobId, .int)
      .field(M2.amount, .int, .required)
      .field(M2.shipping, .int, .required)
      .field(M2.taxes, .int, .required)
      .field(M2.ccFeeOffset, .int, .required)
      .field(M2.shippingLevel, shippingLevel, .required)
      .field(M2.email, .string, .required)
      .field(M2.addressName, .string, .required)
      .field(M2.addressStreet, .string, .required)
      .field(M2.addressStreet2, .string)
      .field(M2.addressCity, .string, .required)
      .field(M2.addressState, .string, .required)
      .field(M2.addressZip, .string, .required)
      .field(M2.addressCountry, .string, .required)
      .field(M2.lang, lang, .required)
      .field(M2.source, source, .required)
      .field(.createdAt, .datetime, .required)
      .field(.updatedAt, .datetime, .required)
      .create()
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: CreateOrders DOWN")
    try await database.schema(M2.tableName).delete()
    try await database.enum(M2.PrintJobStatusEnum.name).delete()
    try await database.enum(M2.ShippingLevelEnum.name).delete()
    try await database.enum(M2.LangEnum.name).delete()
    try await database.enum(M2.SourceEnum.name).delete()
  }
}
