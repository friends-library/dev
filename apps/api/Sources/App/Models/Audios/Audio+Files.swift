import Foundation

struct AudioFiles: Encodable {
  struct Qualities: Encodable {
    let hq: DownloadableFile
    let lq: DownloadableFile

    var all: [DownloadableFile] {
      [hq, lq]
    }
  }

  let podcast: Qualities
  let mp3s: Qualities
  let m4b: Qualities

  var all: [DownloadableFile] {
    podcast.all + mp3s.all + m4b.all
  }
}

extension Audio {
  var files: AudioFiles {
    let edition = edition.require()
    return AudioFiles(
      podcast: .init(
        hq: .init(edition: edition, format: .audio(.podcast(.high))),
        lq: .init(edition: edition, format: .audio(.podcast(.low)))
      ),
      mp3s: .init(
        hq: .init(edition: edition, format: .audio(.mp3s(.high))),
        lq: .init(edition: edition, format: .audio(.mp3s(.low)))
      ),
      m4b: .init(
        hq: .init(edition: edition, format: .audio(.m4b(.high))),
        lq: .init(edition: edition, format: .audio(.m4b(.low)))
      )
    )
  }
}
