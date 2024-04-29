import Fluent

extension Order {
  enum M2 {
    static let tableName = "orders"
    static let id = FieldKey("id")
    static let paymentId = FieldKey("payment_id")
    static let printJobStatus = FieldKey("print_job_status")
    static let printJobId = FieldKey("print_job_id")
    static let amount = FieldKey("amount")
    static let shipping = FieldKey("shipping")
    static let taxes = FieldKey("taxes")
    static let ccFeeOffset = FieldKey("cc_fee_offset")
    static let shippingLevel = FieldKey("shipping_level")
    static let email = FieldKey("email")
    static let addressName = FieldKey("address_name")
    static let addressStreet = FieldKey("address_street")
    static let addressStreet2 = FieldKey("address_street2")
    static let addressCity = FieldKey("address_city")
    static let addressState = FieldKey("address_state")
    static let addressZip = FieldKey("address_zip")
    static let addressCountry = FieldKey("address_country")
    static let lang = FieldKey("lang")
    static let source = FieldKey("source")

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
    static let freeOrderRequestId = FieldKey("free_order_request_id")
  }
}
