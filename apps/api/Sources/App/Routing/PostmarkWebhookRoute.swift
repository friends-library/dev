import DuetSQL
import Vapor
import XCore

enum PostmarkWebhookRoute: RouteHandler {
  @Sendable static func handler(_ request: Request) async throws -> Response {
    guard let json = try await request.collectedBody() else {
      return Response(status: .badRequest)
    }

    guard let event = JSON.decode(SubscriptionChange.self, from: Data(json.utf8)),
          event.RecordType == "SubscriptionChange",
          event.Origin == "Recipient" else {
      return Response(status: .ok)
    }

    let lang: Lang? = switch event.MessageStream {
    case "narrow-path-en": .en
    case "narrow-path-es": .es
    default: nil
    }

    guard let lang else {
      await slackError("Unexpected Postmark webhook event MessageStream: `\(event)`")
      return Response(status: .ok)
    }

    let subscriber = try? await Current.db.query(NPSubscriber.self)
      .where(.email == event.Recipient)
      .where(.lang == lang)
      .first(in: Current.db)

    guard var subscriber else {
      await slackError("Postmark webhook event for unknown subscriber: `\(event)`")
      return Response(status: .ok)
    }

    subscriber.unsubscribedAt = get(dependency: \.date.now)
    _ = try? await Current.db.update(subscriber)

    switch lang {
    case .en:
      try? await sendEnglishResubEmail(subscriber)
    case .es:
      try? await sendSpanishResubEmail(subscriber)
    }

    await slackInfo(
      """
      *Narrow Path UNSUBSCRIBE:*
      _Email:_ \(subscriber.email)
      _Language:_ \(lang == .en ? "English" : "Spanish")
      """,
    )

    return Response(status: .ok)
  }
}

private func sendEnglishResubEmail(_ subscriber: NPSubscriber) async throws {
  let resubUrl = "\(Env.SELF_URL)/np-resubscribe/\(subscriber.id.lowercased)"
  await Current.postmarkClient.send(.init(
    to: subscriber.email,
    from: EmailBuilder.fromAddress(lang: .en),
    subject: "[,] Unsubscribed from The Narrow Path",
    htmlBody: "You’ve successfully unsubscribed from the daily Narrow Path emails from <a href='\(Env.WEBSITE_URL_EN)'>Friends Library</a>. If you didn’t mean to do that, you can re-subscribe by <a href=\"\(resubUrl)\">clicking here</a>.",
  ))
}

private func sendSpanishResubEmail(_ subscriber: NPSubscriber) async throws {
  let resubUrl = "\(Env.SELF_URL)/np-resubscribe/\(subscriber.id.lowercased)"
  await Current.postmarkClient.send(.init(
    to: subscriber.email,
    from: EmailBuilder.fromAddress(lang: .es),
    subject: "[,] Suscripción cancelada de El Camino Estrecho",
    htmlBody: "Te has dado de baja exitosamente de los correos diarios de El Camino Estrecho de <a href='\(Env.WEBSITE_URL_ES)'>La Biblioteca de los Amigos</a>. Si no era tu intención, puedes volver a suscribirte haciendo <a href=\"\(resubUrl)\">clic aquí</a>.",
  ))
}

// https://postmarkapp.com/developer/webhooks/subscription-change-webhook
private struct SubscriptionChange: Decodable {
  let RecordType: String
  // narrow-path-en | narrow-path-es
  let MessageStream: String
  // email address
  let Recipient: String
  // HardBounce | SpamComplaint | ManualSupression (= unsubscribe)
  let SuppressionReason: String
  // Recipient | Customer | Admin
  let Origin: String
}
