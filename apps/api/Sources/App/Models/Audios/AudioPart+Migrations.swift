import Fluent

extension AudioPart {
  enum M21 {
    static let tableName = "edition_audio_parts"
    static let audioId = FieldKey("audio_id")
    static let title = FieldKey("title")
    static let order = FieldKey("order")
    static let duration = FieldKey("duration")
    static let mp3SizeHq = FieldKey("mp3_size_hq")
    static let mp3SizeLq = FieldKey("mp3_size_lq")
    static let externalIdHq = FieldKey("external_id_hq")
    static let externalIdLq = FieldKey("external_id_lq")
    static let chapters = FieldKey("chapters")
  }
}
