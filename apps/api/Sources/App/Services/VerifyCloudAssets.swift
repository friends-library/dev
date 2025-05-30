import Queues
import Vapor

public struct VerifyCloudAssets: AsyncScheduledJob {
  public func run(context: QueueContext) async throws {
    let editionImpressions = try await EditionImpression.Joined.all()
    let audios = try await Audio.Joined.all()
    let audioParts = audios.flatMap(\.parts)

    let impressionFiles = editionImpressions
      .map { $0.files.all.map(\.sourceUrl) }
      .flatMap(\.self)

    let allUrls = impressionFiles
      + audios.flatMap(\.files.all).map(\.sourceUrl)
      + audioParts.flatMap(\.mp3File.all).map(\.sourceUrl)

    let chunks = allUrls
      .filter { !$0.absoluteString.hasSuffix(".rss") } // ignore podcasts
      .map { URI(string: $0.absoluteString) }
      .chunked(into: Env.mode == .dev ? 50 : 25)

    var missing: [String] = []
    for uris in chunks {
      try await missing.append(contentsOf: self.verify(chunk: uris, in: context))
    }

    guard !missing.isEmpty else { return }
    let list = "- " + missing.joined(separator: "\n- ")
    await slackError("Missing \(missing.count)/\(allUrls.count) cloud assets:\n\n\(list)")
  }

  func verify(chunk uris: [URI], in context: QueueContext) async throws -> [String] {
    try await withThrowingTaskGroup(of: String?.self, returning: [String].self) { group in
      let client = context.application.client
      for uri in uris {
        group.addTask {
          let response = try await client.send(.HEAD, to: uri)
          return response.status != .ok ? "missing cloud asset: \(uri)" : nil
        }
      }

      var missing: [String?] = []
      for try await error in group {
        missing.append(error)
      }

      return missing.compactMap(\.self)
    }
  }
}
