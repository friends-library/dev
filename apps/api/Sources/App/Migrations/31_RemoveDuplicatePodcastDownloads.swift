import DuetSQL
import Fluent
import Vapor

struct RemoveDuplicatePodcastDownloads: AsyncMigration {
  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: RemoveDuplicatePodcastDownloads UP")
    guard Env.mode == .prod else {
      return
    }

    let downloads = try await get(dependency: \.db).query(Download.self)
      .where(.format == .enum(Download.Format.podcast))
      .where(.not(.isNull(.ip)))
      .all(in: get(dependency: \.db))

    let duplicates = findDuplicatePodcastDownloads(downloads)

    get(dependency: \.logger).info("  -> found \(duplicates.count) duplicates")
    get(dependency: \.logger).info("  -> preserving \(downloads.count - duplicates.count) unique")

    // uploaded to: s3://storage/duplicate-podcast-downloads.json
    let encoded = try JSONEncoder().encode(duplicates)
    try encoded.write(to: URL(fileURLWithPath: "duplicate-podcast-downloads.json"))
    get(dependency: \.logger).info("  -> wrote duplicates to duplicate-podcast-downloads.json")

    try await duplicates.chunked(into: Postgres.MAX_BIND_PARAMS / 2).asyncForEach {
      get(dependency: \.logger).info("  -> deleting chunk of size: \($0.count)")
      try await get(dependency: \.db).query(Download.self)
        .where(.id |=| $0.map(\.id))
        .delete(in: get(dependency: \.db))
    }

    get(dependency: \.logger).info("  -> completed deletion")
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: RemoveDuplicatePodcastDownloads DOWN")
  }
}

// helpers

func findDuplicatePodcastDownloads(_ all: [Download]) -> [Download] {
  let filtered = all
    .filter { $0.format == .podcast && $0.ip != nil }
    .sorted { $0.createdAt < $1.createdAt }

  var unique: [String: Download] = [:]
  var duplicates: [Download] = []
  for download in filtered {
    let key = "\(download.editionId)-\(download.ip ?? "\(UUID())-\(download.format)")"
    if unique[key] != nil {
      duplicates.append(download)
    } else {
      unique[key] = download
    }
  }

  return duplicates
}

extension Array {
  func chunked(into size: Int) -> [[Element]] {
    stride(from: 0, to: count, by: size).map {
      Array(self[$0 ..< Swift.min($0 + size, count)])
    }
  }
}
