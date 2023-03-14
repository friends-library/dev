import Duet
import Tagged

final class Audio: Codable {
  var id: Id
  var editionId: Edition.Id
  var reader: String
  var isIncomplete: Bool
  var mp3ZipSizeHq: Bytes
  var mp3ZipSizeLq: Bytes
  var m4bSizeHq: Bytes
  var m4bSizeLq: Bytes
  var externalPlaylistIdHq: ExternalPlaylistId?
  var externalPlaylistIdLq: ExternalPlaylistId?
  var createdAt = Current.date()
  var updatedAt = Current.date()

  var edition = Parent<Edition>.notLoaded
  var parts = Children<AudioPart>.notLoaded

  var lang: Lang {
    edition.require().lang
  }

  var humanDurationClock: String {
    AudioUtil.humanDuration(partDurations: parts.require().map(\.duration), style: .clock)
  }

  var humanDurationAbbrev: String {
    AudioUtil.humanDuration(partDurations: parts.require().map(\.duration), style: .abbrev(lang))
  }

  var isPublished: Bool {
    // detect intermediate state between when we have created the audio
    // row in the database and when the cli app finishes processing all the parts
    m4bSizeHq != 0 && parts.require().filter(\.isPublished).count > 0
  }

  init(
    id: Id = .init(),
    editionId: Edition.Id,
    reader: String,
    mp3ZipSizeHq: Bytes,
    mp3ZipSizeLq: Bytes,
    m4bSizeHq: Bytes,
    m4bSizeLq: Bytes,
    externalPlaylistIdHq: ExternalPlaylistId? = nil,
    externalPlaylistIdLq: ExternalPlaylistId? = nil,
    isIncomplete: Bool = false
  ) {
    self.id = id
    self.editionId = editionId
    self.reader = reader
    self.mp3ZipSizeHq = mp3ZipSizeHq
    self.mp3ZipSizeLq = mp3ZipSizeLq
    self.m4bSizeHq = m4bSizeHq
    self.m4bSizeLq = m4bSizeLq
    self.externalPlaylistIdHq = externalPlaylistIdHq
    self.externalPlaylistIdLq = externalPlaylistIdLq
    self.isIncomplete = isIncomplete
  }
}

// extensions

extension Audio {
  typealias ExternalPlaylistId = Tagged<Audio, Int64>
}
