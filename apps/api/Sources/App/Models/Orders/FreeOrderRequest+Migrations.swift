import Fluent

extension FreeOrderRequest {
  enum M6 {
    static let tableName = "free_order_requests"
    nonisolated(unsafe) static let id = FieldKey("id")
    nonisolated(unsafe) static let name = FieldKey("name")
    nonisolated(unsafe) static let email = FieldKey("email")
    nonisolated(unsafe) static let requestedBooks = FieldKey("requested_books")
    nonisolated(unsafe) static let aboutRequester = FieldKey("about_requester")
    nonisolated(unsafe) static let addressStreet = FieldKey("address_street")
    nonisolated(unsafe) static let addressStreet2 = FieldKey("address_street2")
    nonisolated(unsafe) static let addressCity = FieldKey("address_city")
    nonisolated(unsafe) static let addressState = FieldKey("address_state")
    nonisolated(unsafe) static let addressZip = FieldKey("address_zip")
    nonisolated(unsafe) static let addressCountry = FieldKey("address_country")
    nonisolated(unsafe) static let source = FieldKey("source")
  }
}
