import Fluent

extension Audio {
  enum M20 {
    static let tableName = "edition_audios"
    static let editionId = FieldKey("edition_id")
    static let reader = FieldKey("reader")
    static let isIncomplete = FieldKey("is_incomplete")
    static let mp3ZipSizeHq = FieldKey("mp3_zip_size_hq")
    static let mp3ZipSizeLq = FieldKey("mp3_zip_size_lq")
    static let m4bSizeHq = FieldKey("m4b_size_hq")
    static let m4bSizeLq = FieldKey("m4b_size_lq")
    static let externalPlaylistIdHq = FieldKey("external_playlist_id_hq")
    static let externalPlaylistIdLq = FieldKey("external_playlist_id_lq")
  }
}
