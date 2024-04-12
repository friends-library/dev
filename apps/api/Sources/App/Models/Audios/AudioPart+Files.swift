import Foundation
import NonEmpty

extension AudioPart {
  var mp3File: AudioFiles.Qualities {
    fatalError("todo")
    // let audio = audio.require()
    // let edition = audio.edition.require()
    // let index = audio.parts.require().count > 1 ? order - 1 : nil
    // return .init(
    //   hq: .init(edition: edition, format: .audio(.mp3(quality: .high, multipartIndex: index))),
    //   lq: .init(edition: edition, format: .audio(.mp3(quality: .low, multipartIndex: index)))
    // )
  }
}
