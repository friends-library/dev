import Fluent

extension Order {
  enum M2 {
    static let tableName = "orders"
    nonisolated(unsafe) static let id = FieldKey("id")
    nonisolated(unsafe) static let paymentId = FieldKey("payment_id")
    nonisolated(unsafe) static let printJobStatus = FieldKey("print_job_status")
    nonisolated(unsafe) static let printJobId = FieldKey("print_job_id")
    nonisolated(unsafe) static let amount = FieldKey("amount")
    nonisolated(unsafe) static let shipping = FieldKey("shipping")
    nonisolated(unsafe) static let taxes = FieldKey("taxes")
    nonisolated(unsafe) static let ccFeeOffset = FieldKey("cc_fee_offset")
    nonisolated(unsafe) static let shippingLevel = FieldKey("shipping_level")
    nonisolated(unsafe) static let email = FieldKey("email")
    nonisolated(unsafe) static let addressName = FieldKey("address_name")
    nonisolated(unsafe) static let addressStreet = FieldKey("address_street")
    nonisolated(unsafe) static let addressStreet2 = FieldKey("address_street2")
    nonisolated(unsafe) static let addressCity = FieldKey("address_city")
    nonisolated(unsafe) static let addressState = FieldKey("address_state")
    nonisolated(unsafe) static let addressZip = FieldKey("address_zip")
    nonisolated(unsafe) static let addressCountry = FieldKey("address_country")
    nonisolated(unsafe) static let lang = FieldKey("lang")
    nonisolated(unsafe) static let source = FieldKey("source")

    enum PrintJobStatusEnum {
      static let name = "order_print_job_status"
      static let casePresubmit = "presubmit"
      static let casePending = "pending"
      static let caseAccepted = "accepted"
      static let caseRejected = "rejected"
      static let caseShipped = "shipped"
      static let caseCanceled = "canceled"
      static let caseBricked = "bricked"
    }

    enum ShippingLevelEnum {
      static let name = "order_shipping_level"
      static let caseMail = "mail"
      static let casePriorityMail = "priorityMail"
      static let caseGroundHd = "groundHd"
      static let caseGround = "ground"
      static let caseExpedited = "expedited"
      static let caseExpress = "express"
    }

    enum LangEnum {
      static let name = "lang"
      static let caseEn = "en"
      static let caseEs = "es"
    }

    enum SourceEnum {
      static let name = "order_source"
      static let caseWebsite = "website"
      static let caseInternal = "internal"
    }
  }

  enum M7 {
    nonisolated(unsafe) static let freeOrderRequestId = FieldKey("free_order_request_id")
  }
}
