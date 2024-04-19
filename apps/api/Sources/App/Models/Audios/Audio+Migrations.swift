import Fluent

extension Audio {
  enum M20 {
    static let tableName = "edition_audios"
    nonisolated(unsafe) static let editionId = FieldKey("edition_id")
    nonisolated(unsafe) static let reader = FieldKey("reader")
    nonisolated(unsafe) static let isIncomplete = FieldKey("is_incomplete")
    nonisolated(unsafe) static let mp3ZipSizeHq = FieldKey("mp3_zip_size_hq")
    nonisolated(unsafe) static let mp3ZipSizeLq = FieldKey("mp3_zip_size_lq")
    nonisolated(unsafe) static let m4bSizeHq = FieldKey("m4b_size_hq")
    nonisolated(unsafe) static let m4bSizeLq = FieldKey("m4b_size_lq")
    nonisolated(unsafe) static let externalPlaylistIdHq = FieldKey("external_playlist_id_hq")
    nonisolated(unsafe) static let externalPlaylistIdLq = FieldKey("external_playlist_id_lq")
  }
}
