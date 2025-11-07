import DuetSQL
import NonEmpty
import Vapor
import XCore

struct DownloadableFile {
  var format: Format
  var editionId: Edition.Id
  var edition: Edition.DirectoryPathData
  var documentFilename: String

  enum Format: Equatable, Encodable {
    enum Ebook: String, Codable, CaseIterable, Equatable {
      case epub
      case pdf
      case speech
      case app
    }

    enum Audio: Equatable, Encodable {
      enum Quality: Equatable, Encodable {
        case high
        case low
      }

      case podcast(Quality)
      case mp3s(Quality)
      case m4b(Quality)
      case mp3(quality: Quality, multipartIndex: Int?)
    }

    enum Paperback: String, Codable, CaseIterable, Equatable {
      case cover
      case interior
    }

    case ebook(Ebook)
    case audio(Audio)
    case paperback(type: Paperback, volumeIndex: Int?)
  }

  var sourceUrl: URL {
    switch self.format {
    case .ebook, .paperback, .audio(.mp3), .audio(.m4b), .audio(.mp3s):
      return URL(string: "\(Env.CLOUD_STORAGE_BUCKET_URL)/\(self.sourcePath)")!
    case .audio(.podcast):
      let siteUrl = self.edition.document.friend.lang == .en
        ? Env.WEBSITE_URL_EN
        : Env.WEBSITE_URL_ES
      return URL(string: "\(siteUrl)/\(self.sourcePath)")!
    }
  }

  var sourcePath: String {
    switch self.format {
    case .ebook, .paperback, .audio(.mp3), .audio(.m4b), .audio(.mp3s):
      return "\(self.edition.directoryPath)/\(self.filename)"
    case .audio(.podcast(let quality)):
      let pathWithoutLang = self.edition.directoryPath
        .split(separator: "/")
        .dropFirst()
        .joined(separator: "/")
      let qualitySegment = quality == .high ? "" : "lq/"
      return "\(pathWithoutLang)/\(qualitySegment)\(self.filename)"
    }
  }

  var logUrl: URL {
    URL(string: "\(Env.SELF_URL)/\(self.logPath)")!
  }

  var editionFilename: String {
    "\(self.documentFilename)--\(self.edition.type)"
  }

  var filename: String {
    switch self.format {
    case .ebook(.epub):
      "\(self.editionFilename).epub"
    case .ebook(.pdf):
      "\(self.editionFilename).pdf"
    case .ebook(.speech):
      "\(self.editionFilename).html"
    case .ebook(.app):
      "\(self.editionFilename)--(app-ebook).html"
    case .paperback(.interior, let index):
      "\(self.editionFilename)--(print)\(index |> volumeFilenameSuffix).pdf"
    case .paperback(.cover, let index):
      "\(self.editionFilename)--cover\(index |> volumeFilenameSuffix).pdf"
    case .audio(.m4b(let quality)):
      "\(self.documentFilename)\(quality |> qualityFilenameSuffix).m4b"
    case .audio(.mp3s(let quality)):
      "\(self.documentFilename)--mp3s\(quality |> qualityFilenameSuffix).zip"
    case .audio(.mp3(let quality, let index)):
      "\(self.documentFilename)\(index |> partFilenameSuffix)\(quality |> qualityFilenameSuffix).mp3"
    case .audio(.podcast):
      "podcast.rss"
    }
  }

  var logPath: String {
    let id = self.editionId.lowercased
    switch self.format {
    case .ebook(.epub):
      return "download/\(id)/ebook/epub"
    case .ebook(.pdf):
      return "download/\(id)/ebook/pdf"
    case .ebook(.speech):
      return "download/\(id)/ebook/speech"
    case .ebook(.app):
      return "download/\(id)/ebook/app"
    case .paperback(.interior, let index):
      return "download/\(id)/paperback/interior\(index |> volumeLogPathSuffix)"
    case .paperback(.cover, let index):
      return "download/\(id)/paperback/cover\(index |> volumeLogPathSuffix)"
    case .audio(.m4b(let quality)):
      return "download/\(id)/audio/m4b\(quality |> qualityLogPathSuffix)"
    case .audio(.mp3s(let quality)):
      return "download/\(id)/audio/mp3s\(quality |> qualityLogPathSuffix)"
    case .audio(.mp3(let quality, let index)):
      return "download/\(id)/audio/mp3\(index |> partLogPathSuffix)\(quality |> qualityLogPathSuffix)"
    case .audio(.podcast(let quality)):
      return "download/\(id)/audio/podcast\(quality |> qualityLogPathSuffix)/podcast.rss"
    }
  }
}

// parsing init

extension DownloadableFile {
  init(logPath: String) async throws {
    var segments = logPath.split(separator: "/")
    guard !segments.isEmpty, segments.removeFirst() == "download" else {
      throw ParseLogPathError.missingLeadingDownload(logPath)
    }

    guard !segments.isEmpty else {
      throw ParseLogPathError.missingEditionId(logPath)
    }

    guard let editionUuid = UUID(uuidString: segments.removeFirst() |> String.init) else {
      throw ParseLogPathError.invalidEditionId(logPath)
    }

    guard let rows = try? await Current.db.customQuery(
      DownloadData.self,
      withBindings: [.uuid(editionUuid)],
    ), let data = rows.first else {
      throw ParseLogPathError.editionNotFound(logPath)
    }

    switch segments.joined(separator: "/") {
    case "ebook/epub":
      self = .init(data, format: .ebook(.epub))
    case "ebook/pdf":
      self = .init(data, format: .ebook(.pdf))
    case "ebook/speech":
      self = .init(data, format: .ebook(.speech))
    case "ebook/app":
      self = .init(data, format: .ebook(.app))
    case "paperback/interior":
      self = .init(data, format: .paperback(type: .interior, volumeIndex: nil))
    case "paperback/cover":
      self = .init(data, format: .paperback(type: .cover, volumeIndex: nil))
    case "audio/podcast/hq/podcast.rss":
      self = .init(data, format: .audio(.podcast(.high)))
    case "audio/podcast/lq/podcast.rss":
      self = .init(data, format: .audio(.podcast(.low)))
    case "audio/m4b/hq":
      self = .init(data, format: .audio(.m4b(.high)))
    case "audio/m4b/lq":
      self = .init(data, format: .audio(.m4b(.low)))
    case "audio/mp3s/hq":
      self = .init(data, format: .audio(.mp3s(.high)))
    case "audio/mp3s/lq":
      self = .init(data, format: .audio(.mp3s(.low)))
    case "audio/mp3/hq":
      self = .init(data, format: .audio(.mp3(quality: .high, multipartIndex: nil)))
    case "audio/mp3/lq":
      self = .init(data, format: .audio(.mp3(quality: .low, multipartIndex: nil)))
    default:
      guard segments.count >= 3 else {
        throw ParseLogPathError.invalid(logPath)
      }

      let first = segments.removeFirst()
      let second = segments.removeFirst()
      let third = segments.removeFirst()

      switch (first, second) {
      case ("paperback", "interior"):
        guard let index = third |> toIndex,
              validatePaperbackVolume(data.paperbackVolumes, index) else {
          throw ParseLogPathError.invalidPaperbackVolume(logPath)
        }
        self = .init(data, format: .paperback(type: .interior, volumeIndex: index))
      case ("paperback", "cover"):
        guard let index = third |> toIndex,
              validatePaperbackVolume(data.paperbackVolumes, index) else {
          throw ParseLogPathError.invalidPaperbackVolume(logPath)
        }
        self = .init(data, format: .paperback(type: .cover, volumeIndex: index))
      case ("audio", "mp3"):
        guard let index = third |> toIndex,
              validateMp3Part(data.numAudioParts, index) else {
          throw ParseLogPathError.invalidMp3Part(logPath)
        }
        switch segments.first {
        case "hq":
          self = .init(data, format: .audio(.mp3(quality: .high, multipartIndex: index)))
        case "lq":
          self = .init(data, format: .audio(.mp3(quality: .low, multipartIndex: index)))
        default:
          throw ParseLogPathError.invalidMp3Part(logPath)
        }
      default:
        throw ParseLogPathError.invalid(logPath)
      }
    }
  }

  private init(_ data: DownloadData, format: DownloadableFile.Format) {
    let edition = Edition.DirectoryPathData(
      document: .init(
        friend: .init(lang: data.lang, slug: data.friendSlug),
        slug: data.documentSlug,
      ),
      type: data.editionType,
    )
    self.init(
      format: format,
      editionId: data.editionId,
      edition: edition,
      documentFilename: data.documentFilename,
    )
  }

  enum ParseLogPathError: Error, LocalizedError {
    case missingLeadingDownload(String)
    case missingEditionId(String)
    case invalidEditionId(String)
    case editionNotFound(String)
    case invalid(String)
    case invalidPaperbackVolume(String)
    case invalidMp3Part(String)

    var errorDescription: String? {
      switch self {
      case .missingLeadingDownload(let path):
        "Missing leading `download/` segment in path \(path)"
      case .missingEditionId(let path):
        "Missing edition id path \(path)"
      case .invalidEditionId(let path):
        "Invalid edition id in path \(path)"
      case .editionNotFound(let path):
        "Edition not found from path \(path)"
      case .invalid(let path):
        "Invalid path \(path)"
      case .invalidPaperbackVolume(let path):
        "Invalid paperback volume in path \(path)"
      case .invalidMp3Part(let path):
        "Invalid mp3 part in path \(path)"
      }
    }
  }
}

// helpers

private func validatePaperbackVolume(
  _ volumes: NonEmpty<[Int]>,
  _ index: Int,
) -> Bool {
  index >= 0 && index < volumes.count
}

private func validateMp3Part(_ numAudioParts: Int, _ index: Int) -> Bool {
  index >= 0 && index < numAudioParts
}

private func toIndex(_ segment: String.SubSequence) -> Int? {
  guard segment.allSatisfy(\.isWholeNumber),
        let index = Int(String(segment)),
        index > 0 else { return nil }
  return index - 1
}

private func volumeFilenameSuffix(_ index: Int?) -> String {
  guard let index else { return "" }
  return "--v\(index + 1)"
}

private func volumeLogPathSuffix(_ index: Int?) -> String {
  guard let index else { return "" }
  return "/\(index + 1)"
}

private func partFilenameSuffix(_ index: Int?) -> String {
  guard let index else { return "" }
  return "--pt\(index + 1)"
}

private func partLogPathSuffix(_ index: Int?) -> String {
  guard let index else { return "" }
  return "/\(index + 1)"
}

private func qualityFilenameSuffix(_ quality: DownloadableFile.Format.Audio.Quality) -> String {
  switch quality {
  case .high:
    ""
  case .low:
    "--lq"
  }
}

private func qualityLogPathSuffix(_ quality: DownloadableFile.Format.Audio.Quality) -> String {
  switch quality {
  case .high:
    "/hq"
  case .low:
    "/lq"
  }
}

// extensions

extension DownloadableFile.Format {
  var description: String {
    switch self {
    case .ebook(.epub):
      "epub"
    case .ebook(.pdf):
      "web-pdf"
    case .ebook(.speech):
      "speech"
    case .ebook(.app):
      "app-ebook"
    case .audio(.mp3s(let quality)):
      "mp3 zip (\(quality == .high ? "HQ" : "LQ"))"
    case .audio(.m4b(let quality)):
      "m4b audiobook (\(quality == .high ? "HQ" : "LQ"))"
    case .audio(.mp3(let quality, let index)):
      "mp3 \(index == nil ? "" : "pt \(index! + 1) ")(\(quality == .high ? "HQ" : "LQ"))"
    case .audio(.podcast(let quality)):
      "podcast rss feed (\(quality == .high ? "HQ" : "LQ"))"
    case .paperback(type: .cover, let index):
      "paperback cover\(index == nil ? "" : " (v\(index! + 1)")"
    case .paperback(type: .interior, let index):
      "paperback interior\(index == nil ? "" : " (v\(index! + 1)")"
    }
  }

  var downloadFormat: Download.Format? {
    switch self {
    case .ebook(.epub):
      .epub
    case .ebook(.pdf):
      .webPdf
    case .ebook(.speech):
      .speech
    case .ebook(.app):
      .appEbook
    case .audio(.mp3s):
      .mp3Zip
    case .audio(.m4b):
      .m4b
    case .audio(.mp3):
      .mp3
    case .audio(.podcast):
      .podcast
    case .paperback:
      nil
    }
  }

  var audioQuality: Download.AudioQuality? {
    switch self {
    case .ebook, .paperback:
      nil
    case .audio(.mp3s(.high)):
      .hq
    case .audio(.mp3s(.low)):
      .lq
    case .audio(.m4b(.high)):
      .hq
    case .audio(.m4b(.low)):
      .lq
    case .audio(.podcast(.high)):
      .hq
    case .audio(.podcast(.low)):
      .lq
    case .audio(.mp3(quality: .high, multipartIndex: _)):
      .hq
    case .audio(.mp3(quality: .low, multipartIndex: _)):
      .lq
    }
  }

  var audioPartNumber: Int? {
    switch self {
    case .ebook, .paperback:
      return nil
    case .audio(.mp3s), .audio(.m4b), .audio(.podcast):
      return nil
    case .audio(.mp3(quality: _, multipartIndex: let index)):
      if let index {
        return index + 1
      }
      return nil
    }
  }

  var slackChannel: FlpSlack.Message.Channel {
    switch self {
    case .audio(.mp3), .audio(.podcast):
      .audioDownloads
    case .audio, .paperback, .ebook:
      .downloads
    }
  }
}

private struct DownloadData: CustomQueryable {
  static func query(numBindings: Int) -> String {
    """
      SELECT
        e.id as edition_id,
        d.id AS document_id,
        d.\(Document.columnName(.filename)) AS document_filename,
        d.\(Document.columnName(.slug)) AS document_slug,
        e.\(Edition.columnName(.type)) AS edition_type,
        f.\(Friend.columnName(.lang)),
        f.\(Friend.columnName(.slug)) AS friend_slug,
        i.\(EditionImpression.columnName(.paperbackVolumes)),
        COUNT(ap.\(AudioPart.columnName(.audioId)))::INTEGER AS num_audio_parts
      FROM
        \(Edition.tableName) e
      JOIN
        \(Document.tableName) d ON e.\(Edition.columnName(.documentId)) = d.id
      JOIN
        \(Friend.tableName) f ON d.\(Document.columnName(.friendId)) = f.id
      JOIN
        \(EditionImpression.tableName) i ON e.id = i.\(EditionImpression.columnName(.editionId))
      LEFT JOIN
        \(Audio.tableName) a ON e.id = a.\(Audio.columnName(.editionId))
      LEFT JOIN
        \(AudioPart.tableName) ap ON a.id = ap.\(AudioPart.columnName(.audioId))
      WHERE
        e.id = $1
      GROUP BY
        e.id,
        d.id,
        d.\(Document.columnName(.filename)),
        e.\(Edition.columnName(.type)),
        f.\(Friend.columnName(.slug)),
        i.\(EditionImpression.columnName(.paperbackVolumes)),
        f.\(Friend.columnName(.lang));
    """
  }

  var lang: Lang
  var friendSlug: String
  var editionId: Edition.Id
  var documentId: Document.Id
  var documentFilename: String
  var documentSlug: String
  var editionType: EditionType
  var paperbackVolumes: NonEmpty<[Int]>
  var numAudioParts: Int
}
