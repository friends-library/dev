import Testing

@testable import App

@Suite struct StateAbbreviationTests {
  @Test func `shipping address abbreviates full state names`() {
    let tests = [
      ("US", "New York", "NY"),
      ("US", "  North Carolina ", "NC"),
      ("US", "ohio", "OH"),
      ("US", "MICHIGAN", "MI"),
      ("US", "", ""),
      ("US", "not a state", "NOT A STATE"),
      ("US", "  ", "  "),
      ("US", "Alaska", "AK"),
      ("US", "Delaware ", "DE"),
      ("GB", "Delaware", "Delaware"), // only abbreviates for US, CA, AU
      ("CA", "Ontario ", "ON"),
      ("AU", "Victoria", "VIC"),
      ("US", "Tx", "TX"),
    ]

    for (country, input, expected) in tests {
      let address = ShippingAddress(
        name: "name",
        street: "street",
        street2: "street2",
        city: "city",
        state: input,
        zip: "zip",
        country: country,
      )
      #expect(address.state == expected)
    }
  }
}
