import Vapor
import XCore

struct DownloadableFile {
  enum Format: Equatable, Encodable {
    enum Ebook: String, Codable, CaseIterable, Equatable {
      case epub
      case mobi
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

  let format: Format
  let pathData: Edition.DirectoryPathData
  let documentFilename: String

  // let editionId: Edition.Id
  // let documentId:

  // var sourceUrl: URL {
  //   switch format {
  //   case .ebook, .paperback, .audio(.mp3), .audio(.m4b), .audio(.mp3s):
  //     return URL(string: "\(Env.CLOUD_STORAGE_BUCKET_URL)/\(sourcePath)")!
  //   case .audio(.podcast):
  //     let siteUrl = edition.lang == .en ? Env.WEBSITE_URL_EN : Env.WEBSITE_URL_ES
  //     return URL(string: "\(siteUrl)/\(sourcePath)")!
  //   }
  // }

  // var sourcePath: String {
  //   switch format {
  //   case .ebook, .paperback, .audio(.mp3), .audio(.m4b), .audio(.mp3s):
  //     return "\(edition.directoryPath)/\(filename)"
  //   case .audio(.podcast(let quality)):
  //     let pathWithoutLang = edition.directoryPath
  //       .split(separator: "/")
  //       .dropFirst()
  //       .joined(separator: "/")
  //     let qualitySegment = quality == .high ? "" : "lq/"
  //     return "\(pathWithoutLang)/\(qualitySegment)\(filename)"
  //   }
  // }

  var logUrl: URL {
    URL(string: "\(Env.SELF_URL)/\(logPath)")!
  }

  // var filename: String {
  //   switch format {
  //   case .ebook(.epub):
  //     return "\(edition.filename).epub"
  //   case .ebook(.mobi):
  //     return "\(edition.filename).mobi"
  //   case .ebook(.pdf):
  //     return "\(edition.filename).pdf"
  //   case .ebook(.speech):
  //     return "\(edition.filename).html"
  //   case .ebook(.app):
  //     return "\(edition.filename)--(app-ebook).html"
  //   case .paperback(.interior, let index):
  //     return "\(edition.filename)--(print)\(index |> volumeFilenameSuffix).pdf"
  //   case .paperback(.cover, let index):
  //     return "\(edition.filename)--cover\(index |> volumeFilenameSuffix).pdf"
  //   case .audio(.m4b(let quality)):
  //     return "\(edition.document.require().filename)\(quality |> qualityFilenameSuffix).m4b"
  //   case .audio(.mp3s(let quality)):
  //     return "\(edition.document.require().filename)--mp3s\(quality |> qualityFilenameSuffix).zip"
  //   case .audio(.mp3(let quality, let index)):
  //     return "\(edition.document.require().filename)\(index |> partFilenameSuffix)\(quality |> qualityFilenameSuffix).mp3"
  //   case .audio(.podcast):
  //     return "podcast.rss"
  //   }
  // }

  var logPath: String {
    "todo"
    // let id = edition.id.lowercased
    // switch format {
    // case .ebook(.epub):
    //   return "download/\(id)/ebook/epub"
    // case .ebook(.mobi):
    //   return "download/\(id)/ebook/mobi"
    // case .ebook(.pdf):
    //   return "download/\(id)/ebook/pdf"
    // case .ebook(.speech):
    //   return "download/\(id)/ebook/speech"
    // case .ebook(.app):
    //   return "download/\(id)/ebook/app"
    // case .paperback(.interior, let index):
    //   return "download/\(id)/paperback/interior\(index |> volumeLogPathSuffix)"
    // case .paperback(.cover, let index):
    //   return "download/\(id)/paperback/cover\(index |> volumeLogPathSuffix)"
    // case .audio(.m4b(let quality)):
    //   return "download/\(id)/audio/m4b\(quality |> qualityLogPathSuffix)"
    // case .audio(.mp3s(let quality)):
    //   return "download/\(id)/audio/mp3s\(quality |> qualityLogPathSuffix)"
    // case .audio(.mp3(let quality, let index)):
    //   return "download/\(id)/audio/mp3\(index |> partLogPathSuffix)\(quality |> qualityLogPathSuffix)"
    // case .audio(.podcast(let quality)):
    //   return "download/\(id)/audio/podcast\(quality |> qualityLogPathSuffix)/podcast.rss"
    // }
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

    // guard let editionUuid = UUID(uuidString: segments.removeFirst() |> String.init) else {
    //   throw ParseLogPathError.invalidEditionId(logPath)
    // }

    // guard let edition = try? await Current.db.find(Edition.Id(rawValue: editionUuid)) else {
    //   throw ParseLogPathError.editionNotFound(logPath)
    // }

    fatalError("finish me")
    // switch segments.joined(separator: "/") {
    // case "ebook/epub":
    //   self = .init(edition: edition, format: .ebook(.epub))
    // case "ebook/mobi":
    //   self = .init(edition: edition, format: .ebook(.mobi))
    // case "ebook/pdf":
    //   self = .init(edition: edition, format: .ebook(.pdf))
    // case "ebook/speech":
    //   self = .init(edition: edition, format: .ebook(.speech))
    // case "ebook/app":
    //   self = .init(edition: edition, format: .ebook(.app))
    // case "paperback/interior":
    //   self = .init(edition: edition, format: .paperback(type: .interior, volumeIndex: nil))
    // case "paperback/cover":
    //   self = .init(edition: edition, format: .paperback(type: .cover, volumeIndex: nil))
    // case "audio/podcast/hq/podcast.rss":
    //   self = .init(edition: edition, format: .audio(.podcast(.high)))
    // case "audio/podcast/lq/podcast.rss":
    //   self = .init(edition: edition, format: .audio(.podcast(.low)))
    // case "audio/m4b/hq":
    //   self = .init(edition: edition, format: .audio(.m4b(.high)))
    // case "audio/m4b/lq":
    //   self = .init(edition: edition, format: .audio(.m4b(.low)))
    // case "audio/mp3s/hq":
    //   self = .init(edition: edition, format: .audio(.mp3s(.high)))
    // case "audio/mp3s/lq":
    //   self = .init(edition: edition, format: .audio(.mp3s(.low)))
    // case "audio/mp3/hq":
    //   self = .init(edition: edition, format: .audio(.mp3(quality: .high, multipartIndex: nil)))
    // case "audio/mp3/lq":
    //   self = .init(edition: edition, format: .audio(.mp3(quality: .low, multipartIndex: nil)))
    // default:
    //   guard segments.count >= 3 else {
    //     throw ParseLogPathError.invalid(logPath)
    //   }

    //   let first = segments.removeFirst()
    //   let second = segments.removeFirst()
    //   let third = segments.removeFirst()

    //   switch (first, second) {
    //   case ("paperback", "interior"):
    //     guard let index = third |> toIndex,
    //           try await validatePaperbackVolume(edition, index) else {
    //       throw ParseLogPathError.invalidPaperbackVolume(logPath)
    //     }
    //     self = .init(edition: edition, format: .paperback(type: .interior, volumeIndex: index))
    //   case ("paperback", "cover"):
    //     guard let index = third |> toIndex else {
    //       throw ParseLogPathError.invalidPaperbackVolume(logPath)
    //     }
    //     self = .init(edition: edition, format: .paperback(type: .cover, volumeIndex: index))
    //   case ("audio", "mp3"):
    //     guard let index = third |> toIndex,
    //           try await validateMp3Part(edition, index) else {
    //       throw ParseLogPathError.invalidMp3Part(logPath)
    //     }
    //     switch segments.first {
    //     case "hq":
    //       self = .init(
    //         edition: edition,
    //         format: .audio(.mp3(quality: .high, multipartIndex: index))
    //       )
    //     case "lq":
    //       self = .init(
    //         edition: edition,
    //         format: .audio(.mp3(quality: .low, multipartIndex: index))
    //       )
    //     default:
    //       throw ParseLogPathError.invalidMp3Part(logPath)
    //     }
    //   default:
    //     throw ParseLogPathError.invalid(logPath)
    //   }
    // }
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
        return "Missing leading `download/` segment in path \(path)"
      case .missingEditionId(let path):
        return "Missing edition id path \(path)"
      case .invalidEditionId(let path):
        return "Invalid edition id in path \(path)"
      case .editionNotFound(let path):
        return "Edition not found from path \(path)"
      case .invalid(let path):
        return "Invalid path \(path)"
      case .invalidPaperbackVolume(let path):
        return "Invalid paperback volume in path \(path)"
      case .invalidMp3Part(let path):
        return "Invalid mp3 part in path \(path)"
      }
    }
  }
}

// helpers

private func validatePaperbackVolume(_ edition: Edition, _ index: Int) async throws -> Bool {
  guard let impression = try await edition.impression() else {
    return false
  }
  return index >= 0 && index < impression.paperbackVolumes.count
}

private func validateMp3Part(_ edition: Edition, _ index: Int) async throws -> Bool {
  guard let audio = try await edition.audio() else {
    return false
  }
  return index >= 0 && index < audio.parts.require().count
}

private func toIndex(_ segment: String.SubSequence) -> Int? {
  guard segment.allSatisfy(\.isWholeNumber),
        let index = Int(String(segment)),
        index > 0 else { return nil }
  return index - 1
}

private func volumeFilenameSuffix(_ index: Int?) -> String {
  guard let index = index else { return "" }
  return "--v\(index + 1)"
}

private func volumeLogPathSuffix(_ index: Int?) -> String {
  guard let index = index else { return "" }
  return "/\(index + 1)"
}

private func partFilenameSuffix(_ index: Int?) -> String {
  guard let index = index else { return "" }
  return "--pt\(index + 1)"
}

private func partLogPathSuffix(_ index: Int?) -> String {
  guard let index = index else { return "" }
  return "/\(index + 1)"
}

private func qualityFilenameSuffix(_ quality: DownloadableFile.Format.Audio.Quality) -> String {
  switch quality {
  case .high:
    return ""
  case .low:
    return "--lq"
  }
}

private func qualityLogPathSuffix(_ quality: DownloadableFile.Format.Audio.Quality) -> String {
  switch quality {
  case .high:
    return "/hq"
  case .low:
    return "/lq"
  }
}

// extensions

extension DownloadableFile.Format {
  var description: String {
    switch self {
    case .ebook(.epub):
      return "epub"
    case .ebook(.mobi):
      return "mobi"
    case .ebook(.pdf):
      return "web-pdf"
    case .ebook(.speech):
      return "speech"
    case .ebook(.app):
      return "app-ebook"
    case .audio(.mp3s(let quality)):
      return "mp3 zip (\(quality == .high ? "HQ" : "LQ"))"
    case .audio(.m4b(let quality)):
      return "m4b audiobook (\(quality == .high ? "HQ" : "LQ"))"
    case .audio(.mp3(let quality, let index)):
      return "mp3 \(index == nil ? "" : "pt \(index! + 1) ")(\(quality == .high ? "HQ" : "LQ"))"
    case .audio(.podcast(let quality)):
      return "podcast rss feed (\(quality == .high ? "HQ" : "LQ"))"
    case .paperback(type: .cover, let index):
      return "paperback cover\(index == nil ? "" : " (v\(index! + 1)")"
    case .paperback(type: .interior, let index):
      return "paperback interior\(index == nil ? "" : " (v\(index! + 1)")"
    }
  }

  var downloadFormat: Download.Format? {
    switch self {
    case .ebook(.epub):
      return .epub
    case .ebook(.mobi):
      return .mobi
    case .ebook(.pdf):
      return .webPdf
    case .ebook(.speech):
      return .speech
    case .ebook(.app):
      return .appEbook
    case .audio(.mp3s):
      return .mp3Zip
    case .audio(.m4b):
      return .m4b
    case .audio(.mp3):
      return .mp3
    case .audio(.podcast):
      return .podcast
    case .paperback:
      return nil
    }
  }

  var audioQuality: Download.AudioQuality? {
    switch self {
    case .ebook, .paperback:
      return nil
    case .audio(.mp3s(.high)):
      return .hq
    case .audio(.mp3s(.low)):
      return .lq
    case .audio(.m4b(.high)):
      return .hq
    case .audio(.m4b(.low)):
      return .lq
    case .audio(.podcast(.high)):
      return .hq
    case .audio(.podcast(.low)):
      return .lq
    case .audio(.mp3(quality: .high, multipartIndex: _)):
      return .hq
    case .audio(.mp3(quality: .low, multipartIndex: _)):
      return .lq
    }
  }

  var audioPartNumber: Int? {
    switch self {
    case .ebook, .paperback:
      return nil
    case .audio(.mp3s), .audio(.m4b), .audio(.podcast):
      return nil
    case .audio(.mp3(quality: _, multipartIndex: let index)):
      if let index = index {
        return index + 1
      }
      return nil
    }
  }

  var slackChannel: FlpSlack.Message.Channel {
    switch self {
    case .audio(.mp3), .audio(.podcast):
      return .audioDownloads
    case .audio, .paperback, .ebook:
      return .downloads
    }
  }
}
