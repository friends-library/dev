import Foundation

final class SentNPQuote: Codable {
  var id: Id
  var createdAt = Current.date()
  var quoteId: NPQuote.Id

  var isValid: Bool { true }

  init(
    id: Id = .init(),
    quoteId: NPQuote.Id
  ) {
    self.id = id
    self.quoteId = quoteId
  }
}
