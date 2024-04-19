import Fluent

extension AudioPart {
  enum M21 {
    static let tableName = "edition_audio_parts"
    nonisolated(unsafe) static let audioId = FieldKey("audio_id")
    nonisolated(unsafe) static let title = FieldKey("title")
    nonisolated(unsafe) static let order = FieldKey("order")
    nonisolated(unsafe) static let duration = FieldKey("duration")
    nonisolated(unsafe) static let mp3SizeHq = FieldKey("mp3_size_hq")
    nonisolated(unsafe) static let mp3SizeLq = FieldKey("mp3_size_lq")
    nonisolated(unsafe) static let externalIdHq = FieldKey("external_id_hq")
    nonisolated(unsafe) static let externalIdLq = FieldKey("external_id_lq")
    nonisolated(unsafe) static let chapters = FieldKey("chapters")
  }
}
