import Fluent

extension FreeOrderRequest {
  enum M6 {
    static let tableName = "free_order_requests"
    static let id = FieldKey("id")
    static let name = FieldKey("name")
    static let email = FieldKey("email")
    static let requestedBooks = FieldKey("requested_books")
    static let aboutRequester = FieldKey("about_requester")
    static let addressStreet = FieldKey("address_street")
    static let addressStreet2 = FieldKey("address_street2")
    static let addressCity = FieldKey("address_city")
    static let addressState = FieldKey("address_state")
    static let addressZip = FieldKey("address_zip")
    static let addressCountry = FieldKey("address_country")
    static let source = FieldKey("source")
  }
}
