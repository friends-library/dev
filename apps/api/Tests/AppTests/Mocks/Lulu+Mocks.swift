@testable import App

extension Lulu.Api.ShippingAddress {
  static let jared: Self = .init(
    name: "Jared Henderson",
    street1: "8206 Wilhite Dr",
    street2: nil,
    countryCode: "US",
    city: "Wadsworth",
    stateCode: "OH",
    postcode: "44281",
    phoneNumber: "5555555555",
    recipientTaxId: nil
  )

  static let random: Self = .init(
    name: "@name".random,
    street1: "@street1".random,
    street2: Bool.random() ? nil : "@street2".random,
    countryCode: "@countryCode".random,
    city: "@city".random,
    stateCode: "@state".random,
    postcode: "@postcode".random,
    phoneNumber: "5555555555",
    recipientTaxId: nil
  )

  static let empty: Self = .init(
    name: "",
    street1: "",
    street2: nil,
    countryCode: "",
    city: "",
    stateCode: "",
    postcode: "",
    phoneNumber: "5555555555",
    recipientTaxId: nil
  )
}

extension Lulu.Api.PrintJobCostCalculationsBody.LineItem {
  static let mock: Self = .init(
    pageCount: 22,
    podPackageId: "0425X0687BWSTDSS060UW444GXX",
    quantity: 1
  )
}

extension Lulu.Api.PrintJobCostCalculationsResponse {
  static let mock: Self = .init(
    totalCostInclTax: "0.00",
    totalTax: "0.00",
    shippingCost: .init(totalCostExclTax: "0.00"),
    fulfillmentCost: .init(totalCostExclTax: "0.0")
  )

  init(shipping: String, tax: String, total: String, fee: String) {
    self = .mock
    shippingCost.totalCostExclTax = shipping
    totalTax = tax
    totalCostInclTax = total
    fulfillmentCost = .init(totalCostExclTax: fee)
  }
}
