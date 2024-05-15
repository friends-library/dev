import DuetSQL
import Tagged

struct Audio: Codable, Sendable {
  var id: Id
  var editionId: Edition.Id
  var reader: String
  var isIncomplete: Bool
  var mp3ZipSizeHq: Bytes
  var mp3ZipSizeLq: Bytes
  var m4bSizeHq: Bytes
  var m4bSizeLq: Bytes
  var createdAt = Current.date()
  var updatedAt = Current.date()

  init(
    id: Id = .init(),
    editionId: Edition.Id,
    reader: String,
    mp3ZipSizeHq: Bytes,
    mp3ZipSizeLq: Bytes,
    m4bSizeHq: Bytes,
    m4bSizeLq: Bytes,
    isIncomplete: Bool = false
  ) {
    self.id = id
    self.editionId = editionId
    self.reader = reader
    self.mp3ZipSizeHq = mp3ZipSizeHq
    self.mp3ZipSizeLq = mp3ZipSizeLq
    self.m4bSizeHq = m4bSizeHq
    self.m4bSizeLq = m4bSizeLq
    self.isIncomplete = isIncomplete
  }
}

// extensions

extension Audio.Joined {
  var isPublished: Bool {
    // detect intermediate state between when we have created the audio
    // row in the database and when the cli app finishes processing all the parts
    model.m4bSizeHq != 0 && parts.filter(\.isPublished).count > 0
  }

  var humanDurationClock: String {
    AudioUtil.humanDuration(partDurations: parts.map(\.duration), style: .clock)
  }

  var humanDurationAbbrev: String {
    AudioUtil.humanDuration(
      partDurations: parts.map(\.duration),
      style: .abbrev(edition.document.friend.lang)
    )
  }
}
