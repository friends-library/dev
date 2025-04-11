import Foundation
import NonEmpty

struct EditionImpressionFiles {
  struct Ebook {
    let epub: DownloadableFile
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
    self.paperback.interior + self.paperback.cover + [
      self.ebook.epub,
      self.ebook.pdf,
      self.ebook.speech,
      self.ebook.app,
    ]
  }
}

extension Edition.Joined {
  func downloadableFile(format: DownloadableFile.Format) -> DownloadableFile {
    DownloadableFile(
      format: format,
      editionId: model.id,
      edition: directoryPathData,
      documentFilename: document.filename
    )
  }
}

extension EditionImpression.Joined {
  func downloadableFile(format: DownloadableFile.Format) -> DownloadableFile {
    edition.downloadableFile(format: format)
  }

  var files: EditionImpressionFiles {
    var interiors = model.paperbackVolumes.indices.map { index -> DownloadableFile in
      let volumeIndex = model.paperbackVolumes.count == 1 ? nil : index
      return self.downloadableFile(format: .paperback(type: .interior, volumeIndex: volumeIndex))
    }
    var covers = model.paperbackVolumes.indices.map { index -> DownloadableFile in
      let volumeIndex = model.paperbackVolumes.count == 1 ? nil : index
      return self.downloadableFile(format: .paperback(type: .cover, volumeIndex: volumeIndex))
    }

    return EditionImpressionFiles(
      ebook: .init(
        epub: self.downloadableFile(format: .ebook(.epub)),
        pdf: self.downloadableFile(format: .ebook(.pdf)),
        speech: self.downloadableFile(format: .ebook(.speech)),
        app: self.downloadableFile(format: .ebook(.app))
      ),
      paperback: .init(
        interior: .init(interiors.removeFirst()) + interiors,
        cover: .init(covers.removeFirst()) + covers
      )
    )
  }
}
