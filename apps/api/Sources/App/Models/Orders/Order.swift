import DuetSQL
import Tagged
import TaggedMoney

final class Order: Codable {
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
  var createdAt = Current.date()
  var updatedAt = Current.date()

  var items = Children<OrderItem>.notLoaded
  var freeOrderRequest = OptionalParent<FreeOrderRequest>.notLoaded

  var isValid: Bool { true }

  var address: ShippingAddress {
    .init(
      name: addressName,
      street: addressStreet,
      street2: addressStreet2,
      city: addressCity,
      state: addressState,
      zip: addressZip,
      country: addressCountry
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
    freeOrderRequestId: FreeOrderRequest.Id? = nil
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
  }
}

/// extensions

extension Order {
  convenience init(
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
    freeOrderRequestId: FreeOrderRequest.Id? = nil
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
      freeOrderRequestId: freeOrderRequestId
    )
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
