import DuetSQL
import Vapor

enum ConfirmEmailRoute: RouteHandler {
  @Sendable static func handler(_ request: Request) async throws -> Response {
    let langString = request.parameters.get("language")
    let lang: Lang = langString == "es" ? .es : .en

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

    // don't hold up the redirect for this work
    let task = Task { [subscriber] in
      // send them a narrow path, so they can ensure it didn't go to spam
      // and add our sending address to their contact list
      let quote = try await NPQuote.query()
        .where(.lang == subscriber.lang)
        .where(.isFriend == true)
        .first()

      let email = try await quote.email()
      let template = email.template(to: subscriber.email)
      await Current.postmarkClient.sendTemplateEmail(template)
      await slackInfo("NP Subscriber confirmed: `\(subscriber.email)`")
    }

    if Env.mode == .test {
      try await task.value
    }

    return .npRedirect(.confirmEmailSuccess, lang)
  }
}
