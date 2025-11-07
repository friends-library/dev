import PairQL
import XSlack

struct LogJsError: Pair {
  struct Input: PairInput {
    let userAgent: String
    let url: String
    let location: String
    let additionalInfo: String?
    let errorMessage: String?
    let errorName: String?
    let errorStack: String?
    let event: String?
    let source: String?
    let lineNumber: Int?
    let colNumber: Int?
  }
}

// resolver

extension LogJsError: Resolver {
  static func resolve(with input: Input, in context: Context) async throws -> Output {
    await slackError(
      """
      **Runtime JS Error:**
      ```
      \(JSON.encode(input) ?? String(describing: input))
      ```
      """,
    )
    return .success
  }
}
