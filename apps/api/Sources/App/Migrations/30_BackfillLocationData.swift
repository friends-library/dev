import DuetSQL
import Fluent
import Vapor

struct BackfillLocationData: AsyncMigration {
  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: BackfillLocationData UP")

    let downloads = try await Current.db.query(Download.self)
      .where(.not(.isNull(.ip)))
      .all(in: Current.db)

    let data = backfillLocationData(downloads)
    let numFillable = data.updates.reduce(into: 0) { acc, update in
      acc += update.targets.count
    }

    Current.logger.info("  -> found \(numFillable) rows for backfilling")
    Current.logger.info("  -> \(data.missing) will still be missing data")

    // sanity check: ensure pattern ids are unique
    let patternIds = data.updates.map(\.pattern.id)
    let uniquePatternIds = Set(patternIds)
    assert(patternIds.count == uniquePatternIds.count)

    for update in data.updates {
      for var target in update.targets {
        assert(target.ip == update.pattern.ip)
        target.city = update.pattern.city
        target.region = update.pattern.region
        target.postalCode = update.pattern.postalCode
        target.country = update.pattern.country
        target.latitude = update.pattern.latitude
        target.longitude = update.pattern.longitude
      }

      try await update.targets.chunked(into: 100).asyncForEach { chunk in
        Current.logger.info("  -> updating batch chunk of size: \(chunk.count)")
        try await Current.db.update(chunk)
      }
    }
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: BackfillLocationData DOWN")
  }
}

// helpers

func backfillLocationData(_ downloads: [Download])
  -> (updates: [(pattern: Download, targets: [Download])], missing: Int) {
  let withIp = downloads
    .filter { $0.ip != nil }
    .sorted { $0.createdAt > $1.createdAt }

  var patterns: [String: Download] = [:]
  for download in withIp {
    // use CITY as proxy for complete location data, as we always have none, or all
    guard let ip = download.ip, download.city != nil else { continue }
    if patterns[ip] == nil {
      patterns[ip] = download
    }
  }

  var missing = 0
  var updates: [String: (pattern: Download, targets: [Download])] = [:]
  let noLocations = downloads.filter { $0.city == nil }

  for download in noLocations {
    guard let ip = download.ip else { continue }

    guard let pattern = patterns[ip] else {
      missing += 1
      continue
    }

    if let update = updates[ip] {
      updates[ip] = (update.pattern, update.targets + [download])
    } else {
      updates[ip] = (pattern, [download])
    }
  }

  return (updates: Array(updates.values), missing: missing)
}
