import PairQL

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
    try await context.db.create(NativeAppError(
      buildSemver: input.buildSemver,
      buildNumber: input.buildNumber,
      lang: input.lang,
      detail: input.detail,
      platform: input.platform,
      installId: input.installId,
      errorMessage: input.errorMessage,
      errorStack: input.errorStack,
    ))

    return .success
  }
}
