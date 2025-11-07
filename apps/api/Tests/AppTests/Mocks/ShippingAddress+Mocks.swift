@testable import App

extension ShippingAddress {
  static let mock: Self = .init(
    name: "Steve Jobs",
    street: "One Apple Park Way",
    street2: nil,
    city: "Cupertino",
    state: "CA",
    zip: "95014",
    country: "US",
  )
}
