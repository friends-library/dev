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

  var slug: String {
    "chapter-\(self.order)"
  }

  var htmlId: String {
    self.customId ?? self.slug
  }

  var isSequenced: Bool {
    self.sequenceNumber != nil
  }

  var hasNonSequenceTitle: Bool {
    self.nonSequenceTitle != nil
  }

  init(
    id: Id = .init(),
    editionId: Edition.Id,
    order: Int,
    shortHeading: String,
    isIntermediateTitle: Bool,
    customId: String? = nil,
    sequenceNumber: Int? = nil,
    nonSequenceTitle: String? = nil,
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
