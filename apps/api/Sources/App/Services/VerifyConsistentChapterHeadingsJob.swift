import Queues
import Vapor

public struct VerifyConsistentChapterHeadingsJob: AsyncScheduledJob {
  public func run(context: QueueContext) async throws {
    let editions = try await Current.db.query(Edition.self).all()
    for edition in editions {
      try await verifyConsistentChapterHeadings(edition)
    }
  }
}

private func verifyConsistentChapterHeadings(_ edition: Edition) async throws {
  let chapters = try await edition.chapters()
  guard chapters.count > 1 else { return }

  var someShortHeadingsIncludeSequence = false
  var allSequencedShortHeadingsIncludeSequence = true

  for chapter in chapters {
    var shortHeadingIncludesSequence = false
    for start in ["Capítulo ", "Chapter ", "Section ", "Sección "] {
      if chapter.shortHeading.starts(with: start) {
        shortHeadingIncludesSequence = true
      }
    }

    if chapter.isSequenced, shortHeadingIncludesSequence {
      someShortHeadingsIncludeSequence = true
    }

    if chapter.isSequenced, !shortHeadingIncludesSequence {
      allSequencedShortHeadingsIncludeSequence = false
    }
  }

  if someShortHeadingsIncludeSequence, !allSequencedShortHeadingsIncludeSequence {
    await slackError(
      """
      Edition `\(edition.id)` has *inconsistent short headings:*
      ```
      - \(chapters.map(\.shortHeading).joined(separator: "\n- "))
      ```
      """
    )
  }
}
