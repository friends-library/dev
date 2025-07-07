// auto-generated, do not edit
import DuetSQL
import Tagged

extension Order: ApiModel {
  typealias Id = Tagged<Order, UUID>
}

extension Order: Model {
  static let tableName = M2.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      .id(self)
    case .lang:
      .enum(lang)
    case .source:
      .enum(source)
    case .paymentId:
      .string(paymentId.rawValue)
    case .printJobId:
      .int(printJobId?.rawValue)
    case .printJobStatus:
      .enum(printJobStatus)
    case .amount:
      .int(amount.rawValue)
    case .taxes:
      .int(taxes.rawValue)
    case .fees:
      .int(fees.rawValue)
    case .ccFeeOffset:
      .int(ccFeeOffset.rawValue)
    case .shipping:
      .int(shipping.rawValue)
    case .shippingLevel:
      .enum(shippingLevel)
    case .email:
      .string(email.rawValue)
    case .addressName:
      .string(addressName)
    case .addressStreet:
      .string(addressStreet)
    case .addressStreet2:
      .string(addressStreet2)
    case .addressCity:
      .string(addressCity)
    case .addressState:
      .string(addressState)
    case .addressZip:
      .string(addressZip)
    case .addressCountry:
      .string(addressCountry)
    case .freeOrderRequestId:
      .uuid(freeOrderRequestId)
    case .recipientTaxId:
      .string(recipientTaxId)
    case .createdAt:
      .date(createdAt)
    case .updatedAt:
      .date(updatedAt)
    }
  }
}

extension Order {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case lang
    case source
    case paymentId
    case printJobId
    case printJobStatus
    case amount
    case taxes
    case fees
    case ccFeeOffset
    case shipping
    case shippingLevel
    case email
    case addressName
    case addressStreet
    case addressStreet2
    case addressCity
    case addressState
    case addressZip
    case addressCountry
    case freeOrderRequestId
    case recipientTaxId
    case createdAt
    case updatedAt
  }
}

extension Order {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .lang: .enum(lang),
      .source: .enum(source),
      .paymentId: .string(paymentId.rawValue),
      .printJobId: .int(printJobId?.rawValue),
      .printJobStatus: .enum(printJobStatus),
      .amount: .int(amount.rawValue),
      .taxes: .int(taxes.rawValue),
      .fees: .int(fees.rawValue),
      .ccFeeOffset: .int(ccFeeOffset.rawValue),
      .shipping: .int(shipping.rawValue),
      .shippingLevel: .enum(shippingLevel),
      .email: .string(email.rawValue),
      .addressName: .string(addressName),
      .addressStreet: .string(addressStreet),
      .addressStreet2: .string(addressStreet2),
      .addressCity: .string(addressCity),
      .addressState: .string(addressState),
      .addressZip: .string(addressZip),
      .addressCountry: .string(addressCountry),
      .freeOrderRequestId: .uuid(freeOrderRequestId),
      .recipientTaxId: .string(recipientTaxId),
      .createdAt: .currentTimestamp,
      .updatedAt: .currentTimestamp,
    ]
  }
}
