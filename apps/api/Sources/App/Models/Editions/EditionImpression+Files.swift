import Foundation
import Graphiti
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

// extensions

extension AppSchema {
  static var EditionImpressionEbookFilesType: AppType<EditionImpressionFiles.Ebook> {
    Type(EditionImpressionFiles.Ebook.self, as: "EditionImpressionEbookFiles") {
      Field("mobi", at: \.mobi)
      Field("epub", at: \.epub)
      Field("pdf", at: \.pdf)
      Field("app", at: \.app)
      Field("speech", at: \.speech)
    }
  }

  static var EditionImpressionPaperbackFilesType: AppType<EditionImpressionFiles.Paperback> {
    Type(EditionImpressionFiles.Paperback.self, as: "EditionImpressionPaperbackFiles") {
      Field("cover", at: \.cover.rawValue)
      Field("interior", at: \.interior.rawValue)
    }
  }

  static var EditionImpressionFilesType: AppType<EditionImpressionFiles> {
    Type(EditionImpressionFiles.self) {
      Field("ebook", at: \.ebook)
      Field("paperback", at: \.paperback)
    }
  }
}
