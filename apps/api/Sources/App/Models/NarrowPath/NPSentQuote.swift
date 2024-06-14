import Foundation

struct NPSentQuote: Codable, Sendable {
  var id: Id
  var createdAt = Current.date()
  var quoteId: NPQuote.Id

  init(id: Id = .init(), quoteId: NPQuote.Id) {
    self.id = id
    self.quoteId = quoteId
  }
}
