import Foundation

final class SentNPQuote: Codable {
  var id: Id
  var createdAt = Current.date()
  var quoteId: Id

  var isValid: Bool { true }

  init(
    id: Id = .init(),
    quoteId: Id
  ) {
    self.id = id
    self.quoteId = quoteId
  }
}
