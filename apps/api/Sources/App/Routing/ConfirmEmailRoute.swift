import DuetSQL
import Vapor

enum ConfirmEmailRoute: RouteHandler {
  @Sendable static func handler(_ request: Request) async throws -> Response {
    let langString = request.parameters.get("language")
    let lang: Lang = langString == "es" ? .es : .en
    let db = get(dependency: \.db)

    guard let tokenString = request.parameters.get("token"),
          let token = UUID(uuidString: tokenString),
          var subscriber = try? await NPSubscriber
          .query()
          .where(.pendingConfirmationToken == token)
          .first(in: db) else {
      return .npRedirect(.confirmEmailFailure, lang)
    }

    do {
      subscriber.pendingConfirmationToken = nil
      try await db.update(subscriber)
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
        .first(in: db)

      let email = try await quote.email()
      let template = email.template(to: subscriber.email)
      await get(dependency: \.postmarkClient).sendTemplateEmail(template)
      await slackInfo("NP Subscriber confirmed: `\(subscriber.email)`")
    }

    if Env.mode == .test {
      try await task.value
    }

    return .npRedirect(.confirmEmailSuccess, lang)
  }
}

enum NPResubscribeRoute: RouteHandler {
  @Sendable static func handler(_ request: Request) async throws -> Response {
    guard let uuidString = request.parameters.get("id"),
          let uuid = UUID(uuidString: uuidString) else {
      return Response(status: .badRequest)
    }

    let db = get(dependency: \.db)
    guard var subscriber = try? await db.find(NPSubscriber.Id(uuid)) else {
      return Response(status: .notFound)
    }

    let result = await get(dependency: \.postmarkClient).deleteSuppression(
      subscriber.email,
      subscriber.lang,
    )
    switch result {
    case .failure:
      return Response(status: .internalServerError)
    case .success:
      subscriber.unsubscribedAt = nil
      try await db.update(subscriber)
      return .init(
        status: .ok,
        headers: ["Content-Type": "text/html"],
        body: .init(string: "<h1>\(subscriber.lang == .en ? "Success" : "Éxito")</h1>"),
      )
    }
  }
}
