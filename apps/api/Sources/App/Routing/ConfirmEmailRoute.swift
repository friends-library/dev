import DuetSQL
import Vapor
import XCore
import XSlack

enum ConfirmEmailRoute: RouteHandler {
  static func handler(_ request: Request) async throws -> Response {
    let langString = request.parameters.get("language")
    let lang: Lang = langString == "en" ? .en : .es

    // note: more functional way
    guard let tokenString = request.parameters.get("token"),
          let token = UUID(uuidString: tokenString),
          let subscriber = try? await NPSubscriber
          .query()
          .where(.confirmationToken == token)
          .first()
    else {
      return redirect(success: false, lang: lang)
    }

    subscriber.confirmationToken = nil

    try await subscriber.save()

    return redirect(success: true, lang: lang)
  }
}

func redirect(success: Bool, lang: Lang) -> Response {
  .init(
    status: .temporaryRedirect,
    headers: .init([(
      "Location",
      "\(lang == .en ? Env.WEBSITE_URL_EN : Env.WEBSITE_URL_ES)/\(success ? (lang == .en ? "success" : "exito") : (lang == .en ? "failure" : "fracaso"))"
    )])
  )
}
