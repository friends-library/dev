import DuetSQL
import Vapor
import XCore
import XSlack

enum ConfirmEmailRoute: RouteHandler {
  static func handler(_ request: Request) async throws -> Response {
    let langString = request.parameters.get("language")
    let lang: Lang = langString == "en" ? .en : .es

    guard let tokenString = request.parameters.get("token"),
          let token = UUID(uuidString: tokenString),
          let subscriber = try? await NPSubscriber
          .query()
          .where(.confirmationToken == token)
          .first()
    else {
      return redirect(reason: .emailConfirmation, success: false, lang: lang)
    }

    subscriber.confirmationToken = nil

    do { try await subscriber.save() } catch {
      return redirect(reason: .emailConfirmation, success: false, lang: lang)
    }

    return redirect(reason: .emailConfirmation, success: true, lang: lang)
  }
}
