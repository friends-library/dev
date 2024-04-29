import Foundation
import NonEmpty

struct EditionImpressionFiles {
  struct Ebook {
    let epub: DownloadableFile
    let mobi: DownloadableFile
    let pdf: DownloadableFile
    let speech: DownloadableFile
    let app: DownloadableFile
  }

  struct Paperback {
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

extension JoinedEdition {
  func downloadableFile(format: DownloadableFile.Format) -> DownloadableFile {
    DownloadableFile(
      format: format,
      editionId: model.id,
      edition: directoryPathData,
      documentFilename: document.filename
    )
  }
}

extension JoinedEditionImpression {
  func downloadableFile(format: DownloadableFile.Format) -> DownloadableFile {
    edition.downloadableFile(format: format)
  }

  var files: EditionImpressionFiles {
    var interiors = model.paperbackVolumes.indices.map { index -> DownloadableFile in
      let volumeIndex = model.paperbackVolumes.count == 1 ? nil : index
      return downloadableFile(format: .paperback(type: .interior, volumeIndex: volumeIndex))
    }
    var covers = model.paperbackVolumes.indices.map { index -> DownloadableFile in
      let volumeIndex = model.paperbackVolumes.count == 1 ? nil : index
      return downloadableFile(format: .paperback(type: .cover, volumeIndex: volumeIndex))
    }

    return EditionImpressionFiles(
      ebook: .init(
        epub: downloadableFile(format: .ebook(.epub)),
        mobi: downloadableFile(format: .ebook(.mobi)),
        pdf: downloadableFile(format: .ebook(.pdf)),
        speech: downloadableFile(format: .ebook(.speech)),
        app: downloadableFile(format: .ebook(.app))
      ),
      paperback: .init(
        interior: .init(interiors.removeFirst()) + interiors,
        cover: .init(covers.removeFirst()) + covers
      )
    )
  }
}
