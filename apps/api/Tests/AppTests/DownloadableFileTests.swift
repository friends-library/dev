// import ConcurrencyExtras
import DuetSQL
import Vapor
import XCTest
import XExpect

@testable import App

final class DownloadableFileTests: AppTestCase {
  var cloudUrl: String { Env.CLOUD_STORAGE_BUCKET_URL }
  var selfUrl: String { Env.SELF_URL }
  var websiteUrl: String { Env.WEBSITE_URL_EN }

  func getEntities() async throws -> Entities {
    try await Current.db.deleteAll(Download.self)
    try await Current.db.deleteAll(Friend.self, force: true)
    return await Entities.create {
      $0.friend.lang = .en
      $0.edition.type = .updated
      $0.document.filename = "Journal"
    }
  }

  func podcastDownload(
    _ editionId: Edition.Id = .init(),
    ip: String,
    city: String? = nil
  ) -> Download {
    var download = Download.random
    download.editionId = editionId
    download.format = .podcast
    download.ip = ip
    download.city = city
    return download
  }

  func testFindDuplicatePodcastDownloads() async throws {
    let d1 = self.podcastDownload(ip: "1.2.3.4")
    var d2 = self.podcastDownload(d1.editionId, ip: "1.2.3.4") // <-- DUPE, same ed.id and ip
    let d3 = self.podcastDownload(ip: "1.2.3.4") // <-- not dupe, new ed.id
    let d4 = self.podcastDownload(d1.editionId, ip: "1.2.3.5") // <-- not dupe, new ip
    var d5 = self.podcastDownload(d1.editionId, ip: "1.2.3.4") // <-- another DUPE

    d2.createdAt = Date(timeIntervalSince1970: 500)
    d5.createdAt = Date(timeIntervalSince1970: 100) // <-- older than other dupes

    let dupes = findDuplicatePodcastDownloads([d1, d2, d3, d4, d5])
    XCTAssertEqual(dupes, [d2, d1])
  }

  func testBackfillLocationData() {
    var d1 = self.podcastDownload(ip: "1.2.3.4", city: "San Francisco")
    let d2 = self.podcastDownload(ip: "1.2.3.4", city: nil)
    var d3 = self.podcastDownload(ip: "1.2.3.4", city: "Atlanta")
    let d4 = self.podcastDownload(ip: "5.5.5.5", city: nil) // <-- still missing

    // we have two patterns for 1.2.3.4, d3 is newer, it should be used
    d1.createdAt = Date(timeIntervalSince1970: 100)
    d3.createdAt = Date(timeIntervalSince1970: 500)

    let (updates, missing) = backfillLocationData([d1, d2, d3, d4])

    XCTAssertEqual(missing, 1)
    XCTAssertEqual(updates.count, 1)
    XCTAssertEqual(updates[0].pattern, d3)
    XCTAssertEqual(updates[0].targets.count, 1)
    XCTAssertEqual(updates[0].targets[0].id, d2.id)
  }

  func testPodcastAgentsIdentifiedAsPodcast() async throws {
    try await Current.db.deleteAll(Download.self)
    let entities = try await getEntities()
    let userAgents = [
      "lol podcasts",
      "Apple Podcasts",
      "Audible Mozilla Lol",
      "overcast more stuff",
      "tunein more stuff",
      "foobar Castro (like Mozilla) more stuff",
      "castbox more stuff",
      "stitcher more stuff",
    ]
    for userAgent in userAgents {
      let file = entities.edition.downloadableFile(format: .ebook(.epub))
      let res = try await DownloadRoute.logAndRedirect(file: file, userAgent: userAgent)
      let download = try await Current.db.query(Download.self)
        .where(.userAgent == .string(userAgent))
        .first()
      XCTAssertEqual(download.source, .podcast)
      XCTAssertEqual(res.status, Redirect.permanent.status)
    }
  }

  func testBotDownload() async throws {
    let entities = try await getEntities()
    let botUa = "GoogleBot"
    let file = entities.edition.downloadableFile(format: .ebook(.epub))
    let res = try await DownloadRoute.logAndRedirect(file: file, userAgent: botUa)
    let downloads = try await Current.db.query(Download.self)
      .where(.userAgent == .string("GoogleBot"))
      .all()
    XCTAssertEqual([], downloads) // no downloads inserted in db
    XCTAssertEqual(sent.slacks, [.debug("Bot download: `GoogleBot`")])
    XCTAssertEqual(res.headers.first(name: .location), file.sourceUrl.absoluteString)
  }

  func testDownloadHappyPathNoLocationFound() async throws {
    let entities = try await getEntities()
    Current.ipApiClient.getIpData = { _ in throw "whoops" }
    let userAgent = "FriendsLibrary".random
    let device = Current.userAgentParser.parse(userAgent)
    let file = entities.edition.downloadableFile(format: .ebook(.epub))

    let res = try await DownloadRoute.logAndRedirect(
      file: file,
      userAgent: userAgent,
      ipAddress: "1.2.3.4",
      referrer: "https://www.friendslibrary.com"
    )

    let inserted = try await Current.db.query(Download.self)
      .where(.userAgent == .string(userAgent))
      .first()

    XCTAssertEqual(inserted.editionId, entities.edition.id)
    XCTAssertEqual(inserted.format, .epub)
    XCTAssertEqual(inserted.source, .app)
    XCTAssertEqual(inserted.isMobile, device?.isMobile)
    XCTAssertEqual(inserted.os, device?.os)
    XCTAssertEqual(inserted.browser, device?.browser)
    XCTAssertEqual(inserted.platform, device?.platform)
    XCTAssertEqual(inserted.ip, "1.2.3.4")
    XCTAssertEqual(inserted.referrer, "https://www.friendslibrary.com")
    XCTAssertEqual(inserted.audioQuality, nil)
    XCTAssertEqual(inserted.audioPartNumber, nil)
    XCTAssertEqual(res.headers.first(name: .location), file.sourceUrl.absoluteString)
  }

  func testDownloadHappyPathLocationFound() async throws {
    let entities = try await getEntities()
    Current.ipApiClient.getIpData = { ip in
      XCTAssertEqual(ip, "1.2.3.4")
      return .init(
        ip: ip,
        city: "City",
        region: "Region",
        countryName: "CountryName",
        postal: "Postal",
        latitude: 123.456,
        longitude: -123.456
      )
    }

    let userAgent = "Netscape 3.0".random
    let file = entities.edition
      .downloadableFile(format: .audio(.mp3(quality: .high, multipartIndex: 3)))

    _ = try await DownloadRoute.logAndRedirect(
      file: file,
      userAgent: userAgent,
      ipAddress: "1.2.3.4",
      referrer: "https://www.friendslibrary.com"
    )

    let inserted = try await Current.db.query(Download.self)
      .where(.userAgent == .string(userAgent))
      .first()

    XCTAssertEqual(inserted.city, "City")
    XCTAssertEqual(inserted.region, "Region")
    XCTAssertEqual(inserted.postalCode, "Postal")
    XCTAssertEqual(inserted.latitude, "123.456")
    XCTAssertEqual(inserted.longitude, "-123.456")
    XCTAssertEqual(sent.slacks.count, 1)
    XCTAssertEqual(sent.slacks[0].channel, .audioDownloads)
    XCTAssertEqual(sent.slacks[0].message.text, "New download: \(file.logPath)")
  }

  func testAppUaIsNotCountedAsBot() async throws {
    let entities = try await getEntities()
    let userAgent = "FriendsLibrary GoogleBot".random
    let file = entities.edition.downloadableFile(format: .ebook(.epub))

    _ = try await DownloadRoute.logAndRedirect(file: file, userAgent: userAgent)

    let inserted = try await Current.db.query(Download.self)
      .where(.userAgent == .string(userAgent))
      .first()

    XCTAssertEqual(inserted.editionId, entities.edition.id)
  }

  func testDuplicatePodcastDownloadsAreNotLogged() async throws {
    let entities = await Entities.create()

    try await Current.db.create(Download(
      editionId: entities.edition.id,
      format: .podcast,
      source: .podcast,
      isMobile: false,
      ip: "1.2.3.4"
    ))

    let beforeDupe = try await Current.db.query(Download.self)
      .where(.editionId == entities.edition.id)
      .where(.ip == "1.2.3.4")
      .all()

    XCTAssertEqual(beforeDupe.count, 1)
    XCTAssertEqual(beforeDupe.first?.format, .podcast)

    let file = entities.edition.downloadableFile(format: .audio(.podcast(.high)))

    _ = try await DownloadRoute.logAndRedirect(
      file: file,
      userAgent: "",
      ipAddress: "1.2.3.4"
    )

    let afterDupe = try await Current.db.query(Download.self)
      .where(.editionId == entities.edition.id)
      .where(.ip == "1.2.3.4")
      .all()

    XCTAssertEqual(afterDupe.count, 1)
    XCTAssertEqual(afterDupe.first?.id, beforeDupe.first?.id)
  }

  func testInitFromLogPath() async throws {
    let entities = try await getEntities()
    let tests: [(String, DownloadableFile.Format)] = [
      ("ebook/epub", .ebook(.epub)),
      ("ebook/pdf", .ebook(.pdf)),
      ("ebook/speech", .ebook(.speech)),
      ("ebook/app", .ebook(.app)),
      ("paperback/interior", .paperback(type: .interior, volumeIndex: nil)),
      ("paperback/interior/1", .paperback(type: .interior, volumeIndex: 0)),
      ("paperback/cover", .paperback(type: .cover, volumeIndex: nil)),
      ("paperback/cover/1", .paperback(type: .cover, volumeIndex: 0)),
      ("audio/m4b/hq", .audio(.m4b(.high))),
      ("audio/m4b/lq", .audio(.m4b(.low))),
      ("audio/mp3s/hq", .audio(.mp3s(.high))),
      ("audio/mp3s/lq", .audio(.mp3s(.low))),
      ("audio/mp3/hq", .audio(.mp3(quality: .high, multipartIndex: nil))),
      ("audio/mp3/lq", .audio(.mp3(quality: .low, multipartIndex: nil))),
      ("audio/mp3/1/hq", .audio(.mp3(quality: .high, multipartIndex: 0))),
      ("audio/mp3/1/lq", .audio(.mp3(quality: .low, multipartIndex: 0))),
      ("audio/podcast/hq/podcast.rss", .audio(.podcast(.high))),
      ("audio/podcast/lq/podcast.rss", .audio(.podcast(.low))),
    ]

    for (pathEnd, format) in tests {
      let logPath = "download/\(entities.edition.id.lowercased)/\(pathEnd)"
      let downloadable = try await DownloadableFile(logPath: logPath)
      XCTAssertEqual(entities.edition.id, downloadable.editionId)
      XCTAssertEqual(format, downloadable.format)
    }
  }

  func testLogPaths() async throws {
    let entities = try await getEntities()
    let tests: [(DownloadableFile.Format, String)] = [
      (.ebook(.epub), "ebook/epub"),
      (.ebook(.pdf), "ebook/pdf"),
      (.ebook(.speech), "ebook/speech"),
      (.ebook(.app), "ebook/app"),
      (.paperback(type: .interior, volumeIndex: nil), "paperback/interior"),
      (.paperback(type: .interior, volumeIndex: 0), "paperback/interior/1"),
      (.paperback(type: .cover, volumeIndex: nil), "paperback/cover"),
      (.paperback(type: .cover, volumeIndex: 0), "paperback/cover/1"),
      (.audio(.m4b(.high)), "audio/m4b/hq"),
      (.audio(.m4b(.low)), "audio/m4b/lq"),
      (.audio(.mp3s(.high)), "audio/mp3s/hq"),
      (.audio(.mp3s(.low)), "audio/mp3s/lq"),
      (.audio(.mp3(quality: .high, multipartIndex: nil)), "audio/mp3/hq"),
      (.audio(.mp3(quality: .low, multipartIndex: nil)), "audio/mp3/lq"),
      (.audio(.mp3(quality: .high, multipartIndex: 0)), "audio/mp3/1/hq"),
      (.audio(.mp3(quality: .low, multipartIndex: 0)), "audio/mp3/1/lq"),
      (.audio(.podcast(.high)), "audio/podcast/hq/podcast.rss"),
      (.audio(.podcast(.low)), "audio/podcast/lq/podcast.rss"),
    ]

    for (format, pathEnd) in tests {
      let downloadable = entities.edition.downloadableFile(format: format)
      XCTAssertEqual(downloadable.logPath, "download/\(entities.edition.id.lowercased)/\(pathEnd)")
      XCTAssertEqual(downloadable.logUrl.absoluteString, "\(self.selfUrl)/\(downloadable.logPath)")
    }
  }

  func testSourcePath() async throws {
    let entities = try await getEntities()
    let epub = entities.edition.downloadableFile(format: .ebook(.epub))
    expect(epub.sourcePath).toEqual("\(entities.edition.directoryPath)/Journal--updated.epub")
  }

  func testPodcastsSpecialSourcePathsUrls() async throws {
    let entities = try await getEntities()
    let id = entities.edition.id.lowercased
    let edition = entities.edition
    let tests: [(DownloadableFile.Format, String, String, String, String)] = [
      (
        .audio(.podcast(.high)),
        "download/\(id)/audio/podcast/hq/podcast.rss",
        "\(self.selfUrl)/download/\(id)/audio/podcast/hq/podcast.rss",
        "\(edition.directoryPath.replace("^en/", ""))/podcast.rss",
        "\(self.websiteUrl)/\(edition.directoryPath.replace("^en/", ""))/podcast.rss"
      ),
      (
        .audio(.podcast(.low)),
        "download/\(id)/audio/podcast/lq/podcast.rss",
        "\(self.selfUrl)/download/\(id)/audio/podcast/lq/podcast.rss",
        "\(edition.directoryPath.replace("^en/", ""))/lq/podcast.rss",
        "\(self.websiteUrl)/\(edition.directoryPath.replace("^en/", ""))/lq/podcast.rss"
      ),
    ]

    for (format, logPath, logUrl, sourcePath, sourceUrl) in tests {
      let downloadable = entities.edition.downloadableFile(format: format)
      XCTAssertEqual(downloadable.logPath, logPath)
      XCTAssertEqual(downloadable.logUrl.absoluteString, logUrl)
      XCTAssertEqual(downloadable.sourcePath, sourcePath)
      XCTAssertEqual(downloadable.sourceUrl.absoluteString, sourceUrl)
    }
  }

  func testFilenamesAndUrls() async throws {
    let entities = try await getEntities()
    let edition = entities.edition
    let tests: [(DownloadableFile.Format, String)] = [
      (.ebook(.epub), "Journal--updated.epub"),
      (.ebook(.pdf), "Journal--updated.pdf"),
      (.ebook(.speech), "Journal--updated.html"),
      (.ebook(.app), "Journal--updated--(app-ebook).html"),
      (.paperback(type: .interior, volumeIndex: nil), "Journal--updated--(print).pdf"),
      (.paperback(type: .interior, volumeIndex: 0), "Journal--updated--(print)--v1.pdf"),
      (.paperback(type: .cover, volumeIndex: nil), "Journal--updated--cover.pdf"),
      (.paperback(type: .cover, volumeIndex: 0), "Journal--updated--cover--v1.pdf"),
      (.audio(.m4b(.high)), "Journal.m4b"),
      (.audio(.m4b(.low)), "Journal--lq.m4b"),
      (.audio(.mp3s(.high)), "Journal--mp3s.zip"),
      (.audio(.mp3s(.low)), "Journal--mp3s--lq.zip"),
      (.audio(.mp3(quality: .high, multipartIndex: nil)), "Journal.mp3"),
      (.audio(.mp3(quality: .low, multipartIndex: nil)), "Journal--lq.mp3"),
      (.audio(.mp3(quality: .high, multipartIndex: 0)), "Journal--pt1.mp3"),
      (.audio(.mp3(quality: .low, multipartIndex: 0)), "Journal--pt1--lq.mp3"),
      // podcast paths/urls are unique, tested in their own test function above ^^^
    ]

    for (format, expectedFilename) in tests {
      let downloadable = entities.edition.downloadableFile(format: format)
      XCTAssertEqual(downloadable.filename, expectedFilename)
      XCTAssertEqual(
        downloadable.sourceUrl.absoluteString,
        "\(self.cloudUrl)/\(edition.directoryPath)/\(expectedFilename)"
      )
    }
  }
}
