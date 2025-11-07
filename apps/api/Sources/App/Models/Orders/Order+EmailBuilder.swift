import DuetSQL
import XCore
import XPostmark

extension EmailBuilder {
  static func orderShipped(_ order: Order, trackingUrl: String?) async throws -> XPostmark.Email {
    try await XPostmark.Email(
      to: order.email.rawValue,
      from: fromAddress(lang: order.lang),
      subject: order.lang == .en
        ? "[,] Friends Library Order Shipped"
        : "[,] Pedido Enviado – Biblioteca de Amigos",
      textBody: order.lang == .en
        ? shippedBodyEn(for: order, trackingUrl: trackingUrl)
        : shippedBodyEs(for: order, trackingUrl: trackingUrl),
    )
  }

  static func orderConfirmation(_ order: Order) async throws -> XPostmark.Email {
    try await XPostmark.Email(
      to: order.email.rawValue,
      from: fromAddress(lang: order.lang),
      subject: order.lang == .en
        ? "[,] Friends Library Order Confirmation"
        : "[,] Confirmación de Pedido – Biblioteca de Amigos",
      textBody: order.lang == .en
        ? confirmationBodyEn(for: order)
        : confirmationBodyEs(for: order),
    )
  }
}

// helpers

private func lineItems(_ order: Order) async throws -> String {
  let items = try await OrderItem.query()
    .where(.orderId == order.id)
    .all()

  var lines: [String] = []
  for item in items {
    let edition = try await Edition.query()
      .where(.id == item.editionId)
      .first()
    let document = try await Document.query()
      .where(.id == edition.documentId)
      .first()
    lines.append("* (\(item.quantity)) \(document.title)")
  }

  return lines.joined(separator: "\n")
}

func salutation(_ order: Order) -> String {
  if let firstName = order.addressName.split(separator: " ").first, !firstName.isEmpty {
    return "\(firstName),"
  }
  return order.lang == .en ? "Hello!" : "¡Hola!"
}

private func shippedBodyEs(for order: Order, trackingUrl: String?) async throws -> String {
  try await """
  \(order |> salutation)

  ¡Buenas noticias! Tu pedido (\(
    order.id
      .lowercased
  )) que contiene los siguientes artículos ha sido enviado:

  \(lineItems(order))

  Puedes usar el enlace a continuación para rastrear tu paquete:

  \(trackingUrl ?? "(Lo sentimos, no disponible)")

  ¡Por favor no dudes en hacernos saber si tienes alguna pregunta!

  - Biblioteca de Amigos
  """
}

private func shippedBodyEn(for order: Order, trackingUrl: String?) async throws -> String {
  try await """
  \(order |> salutation)

  Good news! Your order (\(
    order.id
      .lowercased
  )) containing the following item(s) has shipped:

  \(lineItems(order))

  To track your package, you can use the below link:

  \(trackingUrl ?? "(Sorry, not available)")

  Please don't hesitate to let us know if you have any questions!

  - Friends Library Publishing
  """
}

private func confirmationBodyEs(for order: Order) async throws -> String {
  try await """
  \(order |> salutation)

  ¡Gracias por realizar un pedido de la Biblioteca de Amigos!  Tu pedido ha sido registrado exitosamente con los siguientes artículos:

  \(lineItems(order))

  Para tu información, el número de referencia de tu pedido es: \(
    order.id
      .lowercased
  ). Dentro de unos pocos días, cuando el envío sea realizado, vamos a enviarte otro correo electrónico con tu número de rastreo. En la mayoría de los casos, el tiempo normal de entrega es de unos 14 a 21 días después de la compra.

  ¡Por favor no dudes en hacernos saber si tienes alguna pregunta!

  - Biblioteca de Amigos
  """
}

private func confirmationBodyEn(for order: Order) async throws -> String {
  try await """
  \(order |> salutation)

  Thanks for ordering from Friends Library Publishing! Your order was successfully created with the following item(s):

  \(lineItems(order))

  For your reference, your order id is: \(
    order.id
      .lowercased
  ). We'll be sending you one more email in a few days with your tracking number, as soon as it ships. For many shipping addresses, a normal delivery date is around 14 to 21 days after purchase.

  Please don't hesitate to let us know if you have any questions!

  - Friends Library Publishing
  """
}
