import Vapor

struct NPRedirect {
  enum Destination {
    case confirmEmailSuccess
    case confirmEmailFailure
  }

  var lang: Lang
  var destination: Destination
}

extension Response {
  static func npRedirect(_ destination: NPRedirect.Destination, _ lang: Lang) -> Response {
    let redirect = NPRedirect(lang: lang, destination: destination)
    return .init(
      status: .temporaryRedirect,
      headers: .init([("Location", redirect.url)]),
    )
  }
}

extension NPRedirect {
  var response: Response {
    .init(
      status: .temporaryRedirect,
      headers: .init([("Location", self.url)]),
    )
  }

  var url: String {
    switch (self.lang, self.destination) {
    case (.en, .confirmEmailSuccess):
      "\(Env.WEBSITE_URL_EN)/narrow-path/confirm-email/success"
    case (.en, .confirmEmailFailure):
      "\(Env.WEBSITE_URL_EN)/narrow-path/confirm-email/failure"
    case (.es, .confirmEmailSuccess):
      "\(Env.WEBSITE_URL_ES)/camino-estrecho/confirmar-correo/exito"
    case (.es, .confirmEmailFailure):
      "\(Env.WEBSITE_URL_ES)/camino-estrecho/confirmar-correo/fallo"
    }
  }
}
