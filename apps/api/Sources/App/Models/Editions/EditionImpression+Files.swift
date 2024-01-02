import Foundation
import NonEmpty

struct EditionImpressionFiles: Encodable {
  struct Ebook: Encodable {
    let epub: DownloadableFile
    let mobi: DownloadableFile
    let pdf: DownloadableFile
    let speech: DownloadableFile
    let app: DownloadableFile
  }

  struct Paperback: Encodable {
    let interior: NonEmpty<[DownloadableFile]>
    let cover: NonEmpty<[DownloadableFile]>
  }

  let ebook: Ebook
  let paperback: Paperback

  var all: [DownloadableFile] {
    paperback.interior + paperback.cover + [
      ebook.epub,
      ebook.mobi,
      ebook.pdf,
      ebook.speech,
      ebook.app,
    ]
  }
}

extension EditionImpression {
  var files: EditionImpressionFiles {
    let edition = edition.require()

    var interiors = paperbackVolumes.indices.map { index -> DownloadableFile in
      let volumeIndex = paperbackVolumes.count == 1 ? nil : index
      return DownloadableFile(
        edition: edition,
        format: .paperback(type: .interior, volumeIndex: volumeIndex)
      )
    }

    var covers = paperbackVolumes.indices.map { index -> DownloadableFile in
      let volumeIndex = paperbackVolumes.count == 1 ? nil : index
      return DownloadableFile(
        edition: edition,
        format: .paperback(type: .cover, volumeIndex: volumeIndex)
      )
    }

    return EditionImpressionFiles(
      ebook: .init(
        epub: .init(edition: edition, format: .ebook(.epub)),
        mobi: .init(edition: edition, format: .ebook(.mobi)),
        pdf: .init(edition: edition, format: .ebook(.pdf)),
        speech: .init(edition: edition, format: .ebook(.speech)),
        app: .init(edition: edition, format: .ebook(.app))
      ),
      paperback: .init(
        interior: .init(interiors.removeFirst()) + interiors,
        cover: .init(covers.removeFirst()) + covers
      )
    )
  }
}
