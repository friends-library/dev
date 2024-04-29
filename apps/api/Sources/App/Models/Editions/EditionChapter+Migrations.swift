import Fluent

extension EditionChapter {
  enum M22 {
    static let tableName = "edition_chapters"
    static let editionId = FieldKey("edition_id")
    static let order = FieldKey("order")
    static let customId = FieldKey("custom_id")
    static let shortHeading = FieldKey("short_heading")
    static let isIntermediateTitle = FieldKey("is_intermediate_title")
    static let sequenceNumber = FieldKey("sequence_number")
    static let nonSequenceTitle = FieldKey("non_sequence_title")
  }
}
