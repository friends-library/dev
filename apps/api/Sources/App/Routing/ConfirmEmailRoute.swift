import DuetSQL
import Vapor
import XCore
import XSlack

enum ConfirmEmailRoute: RouteHandler {
  @Sendable static func handler(_ request: Request) async throws -> Response {
    let langString = request.parameters.get("language")
    let lang: Lang = langString == "en" ? .en : .es

    guard let tokenString = request.parameters.get("token"),
          let token = UUID(uuidString: tokenString),
          var subscriber = try? await NPSubscriber
          .query()
          .where(.pendingConfirmationToken == token)
          .first() else {
      return .npRedirect(.confirmEmailFailure, lang)
    }

    do {
      subscriber.pendingConfirmationToken = nil
      try await subscriber.save()
    } catch {
      return .npRedirect(.confirmEmailFailure, lang)
    }

    return .npRedirect(.confirmEmailSuccess, lang)
  }
}
