import DuetSQL
import Vapor
import XCore
import XSlack

enum UnsubscribeRoute: RouteHandler {
  static func handler(_ request: Request) async throws -> Response {
    let langString = request.parameters.get("language")
    let lang: Lang = langString == "en" ? .en : .es

    guard let idString = request.parameters.get("id"),
          let id = UUID(uuidString: idString),
          let subscriber = try? await NPSubscriber
          .query()
          .where(.id == id)
          .first()
    else {
      return redirect(reason: .unsubscribe, success: false, lang: lang)
    }

    do { try await subscriber.delete() } catch {
      return redirect(reason: .unsubscribe, success: false, lang: lang)
    }

    return redirect(reason: .unsubscribe, success: true, lang: lang)
  }
}
