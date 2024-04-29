import Foundation
import NonEmpty

extension JoinedAudioPart {
  var mp3File: AudioFiles.Qualities {
    let edition = audio.edition
    let index = audio.parts.count > 1 ? model.order - 1 : nil
    return .init(
      hq: edition.downloadableFile(format: .audio(.mp3(quality: .high, multipartIndex: index))),
      lq: edition.downloadableFile(format: .audio(.mp3(quality: .low, multipartIndex: index)))
    )
  }
}
