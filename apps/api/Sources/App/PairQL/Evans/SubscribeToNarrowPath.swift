import DuetSQL
import PairQL
import Vapor
import XCore

struct SubscribeToNarrowPath: Pair {
  struct Input: PairInput {
    let email: EmailAddress
    let lang: Lang
    let mixedQuotes: Bool
    let turnstileToken: String
  }

  typealias Output = Infallible
}

// resolver

extension SubscribeToNarrowPath: Resolver {
  static func resolve(with input: Input, in context: Context) async throws -> Output {
    switch await Current.cloudflareClient.verifyTurnstileToken(input.turnstileToken) {
    case .success:
      break
    case .failure:
      await slackError("Rejected turnstile token for email: `\(input.email)`")
      throw Abort(.badRequest)
    case .error(let error):
      await slackError("""
      *Error verifying turnstile token*
      Data: `\(JSON.encode(input) ?? "nil")`
      Error: \(String(reflecting: error))
      """)
    }

    let existing = try? await NPSubscriber.query()
      .where(.email == input.email.rawValue.lowercased())
      .where(.lang == input.lang)
      .first()
    if existing != nil {
      await slackError("NP subscribe duplicate email error: `\(input.email)`")
      throw Abort(.badRequest, reason: "Email already subscribed")
    }

    let token = Current.uuid()
    try await NPSubscriber(
      token: token,
      mixedQuotes: input.mixedQuotes,
      email: input.email.rawValue.lowercased(),
      lang: input.lang
    ).create()

    await slackInfo(
      """
      *New Narrow Path subscriber:*
      _Email:_ \(input.email.rawValue.lowercased())
      _Language:_ \(input.lang == .en ? "English" : "Spanish")
      _Mixed quotes:_ \(input.mixedQuotes ? "yes" : "no")
      """
    )

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
    subject: "Acción requerida: Confirma tu correo electrónico",
    htmlBody: "Gracias por registrarte para recibir los correos electrónicos del Camino Estrecho. Confirma tu dirección de correo electrónico haciendo <a href=\"\(confirmUrl)\">clic aquí</a>."
  ))
}
