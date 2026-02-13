import Foundation

struct FreeOrderRequest: Codable, Sendable, Equatable {
  var id: Id
  var name: String
  var email: EmailAddress
  var requestedBooks: String
  var aboutRequester: String
  var addressStreet: String
  var addressStreet2: String?
  var addressCity: String
  var addressState: String
  var addressZip: String
  var addressCountry: String
  var source: String
  var createdAt = Current.date()
  var updatedAt = Current.date()

  var address: ShippingAddress {
    .init(
      name: self.name,
      street: self.addressStreet,
      street2: self.addressStreet2,
      city: self.addressCity,
      state: self.addressState,
      zip: self.addressZip,
      country: self.addressCountry,
    )
  }

  init(
    id: Id = .init(),
    name: String,
    email: EmailAddress,
    requestedBooks: String,
    aboutRequester: String,
    addressStreet: String,
    addressStreet2: String?,
    addressCity: String,
    addressState: String,
    addressZip: String,
    addressCountry: String,
    source: String,
  ) {
    self.id = id
    self.name = name
    self.email = email
    self.requestedBooks = requestedBooks
    self.aboutRequester = aboutRequester
    self.addressStreet = addressStreet
    self.addressStreet2 = addressStreet2
    self.addressCity = addressCity
    self.addressState = addressState
    self.addressZip = addressZip
    self.addressCountry = addressCountry
    self.source = source
  }
}

// extensions

extension FreeOrderRequest {
  init(
    id: Id = .init(),
    email: EmailAddress,
    requestedBooks: String,
    aboutRequester: String,
    address: ShippingAddress,
    source: String,
  ) {
    self.init(
      id: id,
      name: address.name,
      email: email,
      requestedBooks: requestedBooks,
      aboutRequester: aboutRequester,
      addressStreet: address.street,
      addressStreet2: address.street2,
      addressCity: address.city,
      addressState: address.state,
      addressZip: address.zip,
      addressCountry: address.country,
      source: source,
    )
  }
}
