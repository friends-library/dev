import PairQL
import XSlack

struct ReportError: Pair {
  struct Input: PairInput {
    var buildSemver: String
    var buildNumber: Int
    var lang: Lang
    var detail: String
    var platform: String
    var installId: String
    var errorMessage: String?
    var errorStack: String?
  }
}

// resolver

extension ReportError: Resolver {
  static func resolve(with input: Input, in context: Context) async throws -> Output {
    try await NativeAppError(
      buildSemver: input.buildSemver,
      buildNumber: input.buildNumber,
      lang: input.lang,
      detail: input.detail,
      platform: input.platform,
      installId: input.installId,
      errorMessage: input.errorMessage,
      errorStack: input.errorStack
    ).create()

    await slackError(
      """
      *Native App Error:*
      _detail:_
      ```
      \(input.detail)
      ```
      _platform:_
      ```
      \(input.platform)
      ```
      _error:_
      ```
      \(input.errorMessage ?? "(nil)")
      ```
      """
    )

    return .success
  }
}
