import PairQL
import Vapor
import XCore
import XPostmark

struct SubmitContactForm: Pair {
  struct Input: PairInput {
    enum Subject: String, Codable {
      case tech
      case other
    }

    let lang: Lang
    let name: String
    let email: String
    let subject: Subject
    let message: String
    let turnstileToken: String
  }
}

// resolver

extension SubmitContactForm: Resolver {
  static func resolve(with input: Input, in context: Context) async throws -> Output {
    try await checkSpam(input)

    let task = Task {
      await get(dependency: \.postmarkClient).send(XPostmark.Email(
        to: input |> emailTo,
        from: EmailBuilder.fromAddress(lang: input.lang),
        replyTo: input.email,
        subject: input.lang |> subject,
        textBody: input |> emailBody,
      ))

      await slackInfo(
        """
        *Contact form submission:*
        _Name:_ \(input.name)
        _Email:_ \(input.email)
        _Message:_ \(input.message)
        """,
      )
    }

    if Env.mode == .test {
      await task.value
    }

    return .success
  }
}

// helpers

private func checkSpam(_ input: SubmitContactForm.Input) async throws {
  switch await get(dependency: \.cloudflareClient).verifyTurnstileToken(input.turnstileToken) {
  case .success:
    break
  case .failure:
    await slackInfo("""
    *Turnstile token rejected for contact form submission*
    Name: \(input.name)
    Email: \(input.email)
    Subject: \(input.subject)
    """)
    throw Abort(.badRequest)
  case .error(let error):
    await slackError("""
    *ERROR verifying turnstile token for contact form*
    Name: \(input.name)
    Email: \(input.email)
    Subject: \(input.subject)
    Error: \(String(reflecting: error))
    """)
  }
}

private func emailBody(_ input: SubmitContactForm.Input) -> String {
  var lines = ["Name: \(input.name)"]
  if input.subject == .tech {
    lines.append("Type: Website / technical question")
  }
  lines.append("Message: \(input.message)")
  return lines.joined(separator: "\n")
}

private func emailTo(_ input: SubmitContactForm.Input) -> String {
  let jared = Env.JARED_CONTACT_FORM_EMAIL
  let jason = Env.JASON_CONTACT_FORM_EMAIL

  if input.lang == .es || input.message.lowercased().contains("jason") {
    return jason
  }

  if input.subject == .tech || input.message.lowercased().contains("jared") {
    return jared
  }

  return Bool.random() ? jared : jason
}

private func subject(_ lang: Lang) -> String {
  let start = lang == .en
    ? "friendslibrary.com contact form"
    : "bibliotecadelosamigos.org formulario de contacto"
  return start + " -- \(get(dependency: \.date.now))"
}
