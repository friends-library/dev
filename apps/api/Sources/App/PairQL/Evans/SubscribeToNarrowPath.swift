import PairQL
import XCore

struct SubscribeToNarrowPath: Pair {
  struct Input: PairInput {
    let email: EmailAddress
    let lang: Lang
    let mixedQuotes: Bool
  }

  typealias Output = Infallible
}

// resolver

extension SubscribeToNarrowPath: Resolver {
  static func resolve(with input: Input, in context: Context) async throws -> Output {
    let token = Current.uuid()
    try await NPSubscriber(
      token: token,
      mixedQuotes: input.mixedQuotes,
      email: input.email.rawValue,
      lang: input.lang
    ).create()

    switch input.lang {
    case .en:
      try await sendEnglishConfirm(to: input.email, confirming: token)
    case .es:
      try await sendSpanishConfirm(to: input.email, confirming: token)
    }

    return .success
  }
}

// helpers

func sendEnglishConfirm(to email: EmailAddress, confirming token: UUID) async throws {
  let confirmUrl = "\(Env.SELF_URL)/confirm-email/en/\(token.lowercased)"
  await Current.postmarkClient.send(.init(
    to: email.rawValue,
    from: EmailBuilder.fromAddress(lang: .en),
    subject: "Action Required: Confirm your email",
    htmlBody: "Thanks for signing up to receive the Narrow Path daily emails! Please confirm your email address by <a href=\"\(confirmUrl)\">clicking here</a>."
  ))
}

func sendSpanishConfirm(to email: EmailAddress, confirming token: UUID) async throws {
  let confirmUrl = "\(Env.SELF_URL)/confirm-email/es/\(token.lowercased)"
  await Current.postmarkClient.send(.init(
    to: email.rawValue,
    from: EmailBuilder.fromAddress(lang: .es),
    subject: "Action Required: Confirm your email",
    htmlBody: "Thanks for signing up to receive the Narrow Path daily emails! Please confirm your email address by <a href=\"\(confirmUrl)\">clicking here</a>."
  ))
}
