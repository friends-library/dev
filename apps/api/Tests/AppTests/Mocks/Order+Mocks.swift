@testable import App

extension Order {
  static var mock: Order {
    Order(
      lang: .en,
      source: .website,
      paymentId: .init(rawValue: "@mock paymentId"),
      printJobStatus: .presubmit,
      amount: 42,
      taxes: 42,
      fees: 42,
      ccFeeOffset: 42,
      shipping: 42,
      shippingLevel: .mail,
      email: "mock@mock.com",
      addressName: "@mock addressName",
      addressStreet: "@mock addressStreet",
      addressStreet2: nil,
      addressCity: "@mock addressCity",
      addressState: "@mock addressState",
      addressZip: "@mock addressZip",
      addressCountry: "@mock addressCountry",
    )
  }

  static var empty: Order {
    Order(
      lang: .en,
      source: .website,
      paymentId: .init(rawValue: ""),
      printJobStatus: .presubmit,
      amount: 0,
      taxes: 0,
      fees: 0,
      ccFeeOffset: 0,
      shipping: 0,
      shippingLevel: .mail,
      email: "",
      addressName: "",
      addressStreet: "",
      addressStreet2: nil,
      addressCity: "",
      addressState: "",
      addressZip: "",
      addressCountry: "",
    )
  }

  static var random: Order {
    Order(
      lang: Lang.allCases.shuffled().first!,
      source: OrderSource.allCases.shuffled().first!,
      paymentId: .init(rawValue: "@random".random),
      printJobStatus: PrintJobStatus.allCases.shuffled().first!,
      amount: .init(rawValue: Int.random),
      taxes: .init(rawValue: Int.random),
      fees: .init(rawValue: Int.random),
      ccFeeOffset: .init(rawValue: Int.random),
      shipping: .init(rawValue: Int.random),
      shippingLevel: ShippingLevel.allCases.shuffled().first!,
      email: .init(rawValue: "@random".random),
      addressName: "@random".random,
      addressStreet: "@random".random,
      addressStreet2: Bool.random() ? "@random".random : nil,
      addressCity: "@random".random,
      addressState: "@random".random,
      addressZip: "@random".random,
      addressCountry: "@random".random,
    )
  }
}
