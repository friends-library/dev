import DuetSQL
import Vapor
import XCore
import XSlack

enum ConfirmEmailRoute: RouteHandler {
  static func handler(_ request: Request) async throws -> Response {
    // note: more functional way
    guard let tokenString = request.parameters.get("token"),
          let token = UUID(uuidString: tokenString),
          let subscriber = try? await NPSubscriber
          .query()
          .where(.confirmationToken == token)
          .first()
    else {
      return redirect(success: false)
    }

    subscriber.confirmationToken = nil

    try await subscriber.save()

    return redirect(success: true)
  }
}

func redirect(success: Bool) -> Response {
  .init(
    status: .temporaryRedirect,
    // TODO: should be language aware
    headers: .init([(
      "Location",
      "https://friendslibrary.com/\(success ? "success" : "failure")"
    )])
  )
}
