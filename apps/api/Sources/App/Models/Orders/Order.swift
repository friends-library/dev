import DuetSQL
import Tagged
import TaggedMoney

struct Order: Codable, Sendable, Equatable {
  var id: Id
  var lang: Lang
  var source: OrderSource
  var paymentId: PaymentId
  var printJobId: PrintJobId?
  var printJobStatus: PrintJobStatus
  var amount: Cents<Int>
  var taxes: Cents<Int>
  var fees: Cents<Int>
  var ccFeeOffset: Cents<Int>
  var shipping: Cents<Int>
  var shippingLevel: ShippingLevel
  var email: EmailAddress
  var addressName: String
  var addressStreet: String
  var addressStreet2: String?
  var addressCity: String
  var addressState: String
  var addressZip: String
  var addressCountry: String
  var freeOrderRequestId: FreeOrderRequest.Id?
  var recipientTaxId: String?
  var createdAt = Date()
  var updatedAt = Date()

  var address: ShippingAddress {
    .init(
      name: self.addressName,
      street: self.addressStreet,
      street2: self.addressStreet2,
      city: self.addressCity,
      state: self.addressState,
      zip: self.addressZip,
      country: self.addressCountry,
      recipientTaxId: self.recipientTaxId,
    )
  }

  init(
    id: Id = .init(),
    printJobId: PrintJobId? = nil,
    lang: Lang,
    source: OrderSource,
    paymentId: PaymentId,
    printJobStatus: PrintJobStatus,
    amount: Cents<Int>,
    taxes: Cents<Int>,
    fees: Cents<Int>,
    ccFeeOffset: Cents<Int>,
    shipping: Cents<Int>,
    shippingLevel: ShippingLevel,
    email: EmailAddress,
    addressName: String,
    addressStreet: String,
    addressStreet2: String?,
    addressCity: String,
    addressState: String,
    addressZip: String,
    addressCountry: String,
    freeOrderRequestId: FreeOrderRequest.Id? = nil,
    recipientTaxId: String? = nil,
  ) {
    self.id = id
    self.printJobId = printJobId
    self.lang = lang
    self.source = source
    self.paymentId = paymentId
    self.printJobStatus = printJobStatus
    self.amount = amount
    self.taxes = taxes
    self.fees = fees
    self.ccFeeOffset = ccFeeOffset
    self.shipping = shipping
    self.shippingLevel = shippingLevel
    self.email = email
    self.addressName = addressName
    self.addressStreet = addressStreet
    self.addressStreet2 = addressStreet2
    self.addressCity = addressCity
    self.addressState = addressState
    self.addressZip = addressZip
    self.addressCountry = addressCountry
    self.freeOrderRequestId = freeOrderRequestId
    self.recipientTaxId = recipientTaxId

    if addressCountry == "US" {
      self.addressState = abbreviate(us: addressState)
    }

    if addressCountry == "CA" {
      self.addressState = abbreviate(ca: addressState)
    }

    if addressCountry == "AU" {
      self.addressState = abbreviate(au: addressState)
    }
  }
}

/// extensions

extension Order {
  init(
    id: Id = .init(),
    printJobId: PrintJobId? = nil,
    lang: Lang,
    source: OrderSource,
    paymentId: PaymentId,
    printJobStatus: PrintJobStatus,
    amount: Cents<Int>,
    taxes: Cents<Int>,
    fees: Cents<Int>,
    ccFeeOffset: Cents<Int>,
    shipping: Cents<Int>,
    shippingLevel: ShippingLevel,
    email: EmailAddress,
    address: ShippingAddress,
    freeOrderRequestId: FreeOrderRequest.Id? = nil,
  ) {
    self.init(
      id: id,
      printJobId: printJobId,
      lang: lang,
      source: source,
      paymentId: paymentId,
      printJobStatus: printJobStatus,
      amount: amount,
      taxes: taxes,
      fees: fees,
      ccFeeOffset: ccFeeOffset,
      shipping: shipping,
      shippingLevel: shippingLevel,
      email: email,
      addressName: address.name,
      addressStreet: address.street,
      addressStreet2: address.street2,
      addressCity: address.city,
      addressState: address.state,
      addressZip: address.zip,
      addressCountry: address.country,
      freeOrderRequestId: freeOrderRequestId,
    )
  }
}

// loaders

extension Order {
  func items(in db: any DuetSQL.Client) async throws -> [OrderItem] {
    try await OrderItem.query()
      .where(.orderId == self.id)
      .all(in: db)
  }
}

// extensions

extension Order {
  enum PrintJobStatus: String, Codable, CaseIterable {
    case presubmit
    case pending
    case accepted
    case rejected
    case shipped
    case canceled
    case bricked
  }

  enum ShippingLevel: String, Codable, CaseIterable {
    case mail
    case priorityMail
    case groundHd
    case groundBus
    case ground
    case expedited
    case express
  }

  enum OrderSource: String, Codable, CaseIterable {
    case website
    case `internal`
  }
}

extension Lang: PostgresEnum {
  var typeName: String { Order.M2.LangEnum.name }
}

extension Order.OrderSource: PostgresEnum {
  var typeName: String { Order.M2.SourceEnum.name }
}

extension Order.ShippingLevel: PostgresEnum {
  var typeName: String { Order.M2.ShippingLevelEnum.name }
}

extension Order.PrintJobStatus: PostgresEnum {
  var typeName: String { Order.M2.PrintJobStatusEnum.name }
}

extension Order {
  typealias PaymentId = Tagged<(order: Order, paymentId: ()), String>
  typealias PrintJobId = Tagged<(order: Order, printJobId: ()), Int>
}
