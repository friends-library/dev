import PairQL
import XCore
import XSendGrid

struct SubscribeToNarrowPath: Pair {
  struct Input: PairInput {
    let email: EmailAddress
    let lang: Lang
    let nonFriendQuotesOptIn: Bool
  }

  typealias Output = SuccessOutput
}

// resolver

extension SubscribeToNarrowPath: Resolver {
  static func resolve(with input: Input, in context: Context) async throws -> Output {
    let token = Current.uuid()

    try await NPSubscriber(
      email: input.email.rawValue,
      lang: input.lang,
      nonFriendQuotesOptIn: input.nonFriendQuotesOptIn,
      confirmationToken: token
    ).create()

    try await Current.sendGridClient.send(.init(
      to: .init(email: input.email.rawValue),
      from: .friendsLibrary,
      subject: "Please confirm your email address",
      html: "<div><a href=\"\(Env.SELF_URL)/confirm-email/en/\(token.lowercased)\">Click here</a></div>"
    ))

    return .success
  }
}
