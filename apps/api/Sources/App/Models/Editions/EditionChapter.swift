import Duet

struct EditionChapter: Codable, Sendable {
  var id: Id
  var editionId: Edition.Id
  var order: Int
  var shortHeading: String
  var isIntermediateTitle: Bool
  var customId: String?
  var sequenceNumber: Int?
  var nonSequenceTitle: String?
  var createdAt = Current.date()
  var updatedAt = Current.date()

  var edition = Parent<Edition>.notLoaded

  var slug: String {
    "chapter-\(order)"
  }

  var htmlId: String {
    customId ?? slug
  }

  var isSequenced: Bool {
    sequenceNumber != nil
  }

  var hasNonSequenceTitle: Bool {
    nonSequenceTitle != nil
  }

  init(
    id: Id = .init(),
    editionId: Edition.Id,
    order: Int,
    shortHeading: String,
    isIntermediateTitle: Bool,
    customId: String? = nil,
    sequenceNumber: Int? = nil,
    nonSequenceTitle: String? = nil
  ) {
    self.id = id
    self.editionId = editionId
    self.order = order
    self.shortHeading = shortHeading
    self.isIntermediateTitle = isIntermediateTitle
    self.customId = customId
    self.sequenceNumber = sequenceNumber
    self.nonSequenceTitle = nonSequenceTitle
  }
}
