import DuetSQL
import XCore
import XSendGrid

extension EmailBuilder {
  static func orderShipped(_ order: Order, trackingUrl: String?) async throws -> SendGrid.Email {
    SendGrid.Email(
      to: .init(email: order.email.rawValue, name: order.addressName),
      from: fromAddress(lang: order.lang),
      subject: order.lang == .en
        ? "[,] Friends Library Order Shipped"
        : "[,] Pedido Enviado – Biblioteca de Amigos",
      text: order.lang == .en
        ? try await shippedBodyEn(for: order, trackingUrl: trackingUrl)
        : try await shippedBodyEs(for: order, trackingUrl: trackingUrl)
    )
  }

  static func orderConfirmation(_ order: Order) async throws -> SendGrid.Email {
    SendGrid.Email(
      to: .init(email: order.email.rawValue, name: order.addressName),
      from: fromAddress(lang: order.lang),
      subject: order.lang == .en
        ? "[,] Friends Library Order Confirmation"
        : "[,] Confirmación de Pedido – Biblioteca de Amigos",
      text: order.lang == .en
        ? try await confirmationBodyEn(for: order)
        : try await confirmationBodyEs(for: order)
    )
  }
}

// helpers

private func lineItems(_ order: Order) async throws -> String {
  var items = try await Current.db.query(OrderItem.self)
    .where(.orderId == order.id)
    .all()

  for (idx, item) in items.enumerated() {
    if !item.edition.isLoaded {
      let edition = try await Current.db.query(Edition.self)
        .where(.id == item.editionId)
        .first()
      items[idx].edition = .loaded(edition)
    }
  }

  return items.map { item in
    "* (\(item.quantity)) \(item.edition.require().document.require().title)"
  }.joined(separator: "\n")
}

func salutation(_ order: Order) -> String {
  if let firstName = order.addressName.split(separator: " ").first, !firstName.isEmpty {
    return "\(firstName),"
  }
  return order.lang == .en ? "Hello!" : "¡Hola!"
}

private func shippedBodyEs(for order: Order, trackingUrl: String?) async throws -> String {
  """
  \(order |> salutation)

  ¡Buenas noticias! Tu pedido (\(order.id
    .lowercased)) que contiene los siguientes artículos ha sido enviado:

  \(try await lineItems(order))

  Puedes usar el enlace a continuación para rastrear tu paquete:

  \(trackingUrl ?? "<em>Lo sentimos, no disponible</em>")

  ¡Por favor no dudes en hacernos saber si tienes alguna pregunta!

  - Biblioteca de Amigos
  """
}

private func shippedBodyEn(for order: Order, trackingUrl: String?) async throws -> String {
  """
  \(order |> salutation)

  Good news! Your order (\(order.id.lowercased)) containing the following item(s) has shipped:

  \(try await lineItems(order))

  To track your package, you can use the below link:

  \(trackingUrl ?? "<em>Sorry, not available</em>")

  Please don't hesitate to let us know if you have any questions!

  - Friends Library Publishing
  """
}

private func confirmationBodyEs(for order: Order) async throws -> String {
  """
  \(order |> salutation)

  ¡Gracias por realizar un pedido de la Biblioteca de Amigos!  Tu pedido ha sido registrado exitosamente con los siguientes artículos:

  \(try await lineItems(order))

  Para tu información, el número de referencia de tu pedido es: \(order.id
    .lowercased). Dentro de unos pocos días, cuando el envío sea realizado, vamos a enviarte otro correo electrónico con tu número de rastreo. En la mayoría de los casos, el tiempo normal de entrega es de unos 7 a 14 días después de la compra.

  ¡Por favor no dudes en hacernos saber si tienes alguna pregunta!

  - Biblioteca de Amigos
  """
}

private func confirmationBodyEn(for order: Order) async throws -> String {
  """
  \(order |> salutation)

  Thanks for ordering from Friends Library Publishing! Your order was successfully created with the following item(s):

  \(try await lineItems(order))

  For your reference, your order id is: \(order.id
    .lowercased). We'll be sending you one more email in a few days with your tracking number, as soon as it ships. For many shipping addresses, a normal delivery date is around 7 to 14 days after purchase.

  Please don't hesitate to let us know if you have any questions!

  - Friends Library Publishing
  """
}
