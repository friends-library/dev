import PairQL
import XPostmark

struct CreateFreeOrderRequest: Pair {
  struct Input: PairInput {
    let name: String
    let email: EmailAddress
    let requestedBooks: String
    let aboutRequester: String
    let addressStreet: String
    let addressStreet2: String?
    let addressCity: String
    let addressState: String
    let addressZip: String
    let addressCountry: String
    let source: String
  }
}

// resolver

extension CreateFreeOrderRequest: Resolver {
  static func resolve(with input: Input, in context: Context) async throws -> Output {
    let order = try await Current.db.create(FreeOrderRequest(
      name: input.name,
      email: input.email,
      requestedBooks: input.requestedBooks,
      aboutRequester: input.aboutRequester,
      addressStreet: input.addressStreet,
      addressStreet2: input.addressStreet2,
      addressCity: input.addressCity,
      addressState: input.addressState,
      addressZip: input.addressZip,
      addressCountry: input.addressCountry,
      source: input.source,
    ))

    try await sendFreeOrderRequestNotifications(for: order)

    return .success
  }
}

// email helpers

private func sendFreeOrderRequestNotifications(for order: FreeOrderRequest) async throws {
  let id = order.id.rawValue.uuidString.lowercased()
  if let emailTo = Env.get("FREE_ORDER_REQUEST_EMAIL_RECIPIENT") {
    let email = XPostmark.Email(
      to: emailTo,
      from: "info@friendslibrary.com",
      subject: "[,] Free Book Request - \(id)",
      htmlBody:
      """
      \(entry("Name", order.name))
      \(entry("Email", order.email.rawValue))
      \(entry("Requested Books", order.requestedBooks))
      \(entry("About Requester", order.aboutRequester))
      \(entry("Street", order.addressStreet))
      \(entry("Street 2", order.addressStreet2))
      \(entry("City", order.addressCity))
      \(entry("State", order.addressState))
      \(entry("Zip", order.addressZip))
      \(entry("Country", order.addressCountry))
      \(entry("Source", order.source))

      <br />
      <br />

      <a href="https://admin.friendslibrary.com/orders/new?request=\(id)">
        Create Order &raquo;
      </a>
      """,
    )
    await Current.postmarkClient.send(email)
  }

  if Env.mode == .prod {
    let text =
      "New *Spanish Free Book Order Request:*\n  → _Name_ `\(order.name)`\n  → _Books_ `\(order.requestedBooks)`\n  → _About_ `\(order.aboutRequester.replacingOccurrences(of: "\n", with: ""))`"
    await Current.slackClient.send(.order(text, emoji: .orangeBook))
  }
}

private func entry(_ key: String, _ value: String?) -> String {
  guard let value else {
    return ""
  }
  return
    """
    <p>
      <b>\(key):</b>&nbsp;
      \(value.replacingOccurrences(of: "\n", with: "<br />"))
    </p>
    """
}
