import PairQL
import XCore
import XSendGrid

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

    let confirmUrl = "\(Env.SELF_URL)/confirm-email/\(input.lang)/\(token.lowercased)"
    await Current.postmarkClient.send(.init(
      to: input.email.rawValue,
      from: EmailBuilder.fromAddress(lang: input.lang),
      subject: "Please confirm your email address",
      htmlBody: "<a href=\"\(confirmUrl)\">Click here</a>"
    ))

    return .success
  }
}
