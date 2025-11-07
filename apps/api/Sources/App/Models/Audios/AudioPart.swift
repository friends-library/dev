import Duet
import NonEmpty
import Tagged
import TaggedTime

struct AudioPart: Codable, Sendable {
  var id: Id
  var audioId: Audio.Id
  var title: String
  var duration: Seconds<Double>
  var chapters: NonEmpty<[Int]>
  var order: Int
  var mp3SizeHq: Bytes
  var mp3SizeLq: Bytes
  var createdAt = Current.date()
  var updatedAt = Current.date()

  var isPublished: Bool {
    // detect intermediate state between when we have created the audio part row
    // in the database (via web gui), but have not finished processing the new
    // audio part via the CLI command
    self.mp3SizeHq != 0
  }

  init(
    id: Id = .init(),
    audioId: Audio.Id,
    title: String,
    duration: Seconds<Double>,
    chapters: NonEmpty<[Int]>,
    order: Int,
    mp3SizeHq: Bytes,
    mp3SizeLq: Bytes,
  ) {
    self.id = id
    self.audioId = audioId
    self.title = title
    self.duration = duration
    self.chapters = chapters
    self.order = order
    self.mp3SizeHq = mp3SizeHq
    self.mp3SizeLq = mp3SizeLq
  }
}
