import Foundation

struct ShippingAddress: Codable, Equatable {
  var name: String
  var street: String
  var street2: String?
  var city: String
  var state: String
  var zip: String
  var country: String
  var recipientTaxId: String?

  init(
    name: String,
    street: String,
    street2: String? = nil,
    city: String,
    state: String,
    zip: String,
    country: String,
    recipientTaxId: String? = nil,
  ) {
    self.name = name
    self.street = street
    self.street2 = street2
    self.city = city
    self.state = state
    self.zip = zip
    self.country = country
    self.recipientTaxId = recipientTaxId

    if country == "US" {
      self.state = abbreviate(us: state)
    }

    if country == "CA" {
      self.state = abbreviate(ca: state)
    }

    if country == "AU" {
      self.state = abbreviate(au: state)
    }
  }
}

// helpers

func abbreviate(au input: String) -> String {
  let states = [
    "australian capital territory": "ACT",
    "new south wales": "NSW",
    "queensland": "QLD",
    "south australia": "SA",
    "tasmania": "TAS",
    "victoria": "VIC",
    "western australia": "WA",
    "jervis bay teritory": "JBT",
    "northern territory": "NT",
  ]

  let lowercaseInput = input
    .trimmingCharacters(in: .whitespacesAndNewlines)
    .lowercased()

  return states[lowercaseInput] ?? input.uppercased()
}

func abbreviate(ca input: String) -> String {
  let provinces = [
    "alberta": "AB",
    "british columbia": "BC",
    "manitoba": "MB",
    "new brunswick": "NB",
    "newfoundland and labrador": "NL",
    "labrador": "NL",
    "newfoundland": "NL",
    "nova scotia": "NS",
    "northwest territories": "NT",
    "nunavut": "NU",
    "ontario": "ON",
    "prince edward island": "PE",
    "pie": "PE",
    "quebec": "QC",
    "que": "QC",
    "saskatchewan": "SK",
    "yukon": "YT",
  ]

  let lowercaseInput = input
    .trimmingCharacters(in: .whitespacesAndNewlines)
    .lowercased()

  return provinces[lowercaseInput] ?? input.uppercased()
}

func abbreviate(us input: String) -> String {
  let states = [
    "alabama": "AL",
    "alaska": "AK",
    "arizona": "AZ",
    "arkansas": "AR",
    "california": "CA",
    "colorado": "CO",
    "connecticut": "CT",
    "delaware": "DE",
    "florida": "FL",
    "georgia": "GA",
    "hawaii": "HI",
    "idaho": "ID",
    "illinois": "IL",
    "indiana": "IN",
    "iowa": "IA",
    "kansas": "KS",
    "kentucky": "KY",
    "louisiana": "LA",
    "maine": "ME",
    "maryland": "MD",
    "massachusetts": "MA",
    "michigan": "MI",
    "minnesota": "MN",
    "mississippi": "MS",
    "missouri": "MO",
    "montana": "MT",
    "nebraska": "NE",
    "nevada": "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    "ohio": "OH",
    "oklahoma": "OK",
    "oregon": "OR",
    "pennsylvania": "PA",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    "tennessee": "TN",
    "texas": "TX",
    "utah": "UT",
    "vermont": "VT",
    "virginia": "VA",
    "washington": "WA",
    "west virginia": "WV",
    "wisconsin": "WI",
    "wyoming": "WY",
  ]

  let lowercaseInput = input
    .trimmingCharacters(in: .whitespacesAndNewlines)
    .lowercased()

  return states[lowercaseInput] ?? input.uppercased()
}
