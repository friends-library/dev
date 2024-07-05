import Vapor

struct NPRedirect {
  enum Destination {
    case confirmEmailSuccess
    case confirmEmailFailure
    case unsubscribeSuccess
    case unsubscribeFailure
  }

  var lang: Lang
  var destination: Destination
}

extension Response {
  static func npRedirect(_ destination: NPRedirect.Destination, _ lang: Lang) -> Response {
    let redirect = NPRedirect(lang: lang, destination: destination)
    return .init(
      status: .temporaryRedirect,
      headers: .init([("Location", redirect.url)])
    )
  }
}

extension NPRedirect {
  var response: Response {
    .init(
      status: .temporaryRedirect,
      headers: .init([("Location", url)])
    )
  }

  var url: String {
    switch (lang, destination) {
    case (.en, .confirmEmailSuccess):
      return "\(Env.WEBSITE_URL_EN)/narrow-path/confirm-email/success"
    case (.en, .confirmEmailFailure):
      return "\(Env.WEBSITE_URL_EN)/narrow-path/confirm-email/failure"
    case (.en, .unsubscribeSuccess):
      return "\(Env.WEBSITE_URL_EN)/narrow-path/unsubscribe/success"
    case (.en, .unsubscribeFailure):
      return "\(Env.WEBSITE_URL_EN)/narrow-path/unsubscribe/failure"
    // TODO: real translations
    case (.es, .confirmEmailSuccess):
      return "\(Env.WEBSITE_URL_ES)/camino-estrecho/confirmar-email/exito"
    case (.es, .confirmEmailFailure):
      return "\(Env.WEBSITE_URL_ES)/camino-estrecho/confirmar-email/fallo"
    case (.es, .unsubscribeSuccess):
      return "\(Env.WEBSITE_URL_ES)/camino-estrecho/cancelar-suscripcion/exito"
    case (.es, .unsubscribeFailure):
      return "\(Env.WEBSITE_URL_ES)/camino-estrecho/cancelar-suscripcion/fallo"
    }
  }
}
