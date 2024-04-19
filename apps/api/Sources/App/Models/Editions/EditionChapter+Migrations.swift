import Fluent

extension EditionChapter {
  enum M22 {
    static let tableName = "edition_chapters"
    nonisolated(unsafe) static let editionId = FieldKey("edition_id")
    nonisolated(unsafe) static let order = FieldKey("order")
    nonisolated(unsafe) static let customId = FieldKey("custom_id")
    nonisolated(unsafe) static let shortHeading = FieldKey("short_heading")
    nonisolated(unsafe) static let isIntermediateTitle = FieldKey("is_intermediate_title")
    nonisolated(unsafe) static let sequenceNumber = FieldKey("sequence_number")
    nonisolated(unsafe) static let nonSequenceTitle = FieldKey("non_sequence_title")
  }
}
