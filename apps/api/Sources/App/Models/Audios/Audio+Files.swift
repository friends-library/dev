import Foundation

struct AudioFiles {
  struct Qualities {
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

extension Audio.Joined {
  var files: AudioFiles {
    AudioFiles(
      podcast: .init(
        hq: edition.downloadableFile(format: .audio(.podcast(.high))),
        lq: edition.downloadableFile(format: .audio(.podcast(.low)))
      ),
      mp3s: .init(
        hq: edition.downloadableFile(format: .audio(.mp3s(.high))),
        lq: edition.downloadableFile(format: .audio(.mp3s(.low)))
      ),
      m4b: .init(
        hq: edition.downloadableFile(format: .audio(.m4b(.high))),
        lq: edition.downloadableFile(format: .audio(.m4b(.low)))
      )
    )
  }
}
