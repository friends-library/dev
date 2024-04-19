import DuetSQL
import Fluent

extension Edition {
  enum M17 {
    static let tableName = "editions"
    nonisolated(unsafe) static let documentId = FieldKey("document_id")
    nonisolated(unsafe) static let type = FieldKey("type")
    nonisolated(unsafe) static let editor = FieldKey("editor")
    nonisolated(unsafe) static let isDraft = FieldKey("is_draft")
    nonisolated(unsafe) static let paperbackOverrideSize = FieldKey("paperback_override_size")
    nonisolated(unsafe) static let paperbackSplits = FieldKey("paperback_splits")
    enum PrintSizeVariantEnum {
      static let name = "print_size_variants"
      static let caseS = "s"
      static let caseM = "m"
      static let caseXl = "xl"
      static let caseXlCondensed = "xlCondensed"
    }
  }
}

extension PrintSizeVariant: PostgresEnum {
  var typeName: String {
    Edition.M17.PrintSizeVariantEnum.name
  }
}
