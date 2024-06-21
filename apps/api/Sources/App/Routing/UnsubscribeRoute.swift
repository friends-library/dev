import DuetSQL
import Vapor
import XCore
import XSlack

// TODO: maybe remove if postmark handles unsubscribes
enum UnsubscribeRoute: RouteHandler {
  @Sendable static func handler(_ request: Request) async throws -> Response {
    let langString = request.parameters.get("language")
    let lang: Lang = langString == "en" ? .en : .es

    guard let idString = request.parameters.get("id"),
          let id = UUID(uuidString: idString),
          let subscriber = try? await NPSubscriber.find(.init(id)) else {
      return .npRedirect(.unsubscribeFailure, lang)
    }

    do {
      try await subscriber.delete()
      return .npRedirect(.unsubscribeSuccess, lang)
    } catch {
      return .npRedirect(.unsubscribeFailure, lang)
    }
  }
}
