import DuetSQL
import NonEmpty
import TaggedMoney

enum PrintJobs {
  static func create(_ order: Order) async throws -> Lulu.Api.PrintJob {
    let orderItems = try await OrderItem.query()
      .where(.orderId == order.id)
      .all()

    let lineItems = try await orderItems.concurrentMap { item in
      let edition = try await Edition.query()
        .where(.id == item.editionId)
        .first()
      guard let impression = edition.impression.require() else {
        throw Error.unexpectedMissingEditionImpression(order.id, edition.id)
      }
      return try await impression.paperbackVolumes.enumerated().concurrentMap { index, pages in
        let titleSuffix = impression.paperbackVolumes.count > 1 ? ", vol. \(index + 1)" : ""
        let files = try await impression.files()
        return Lulu.Api.CreatePrintJobBody.LineItem(
          title: edition.document.require().title + titleSuffix,
          cover: files.paperback.cover[index].sourceUrl.absoluteString,
          interior: files.paperback.interior[index].sourceUrl.absoluteString,
          podPackageId: Lulu.podPackageId(
            size: impression.paperbackSizeVariant.printSize,
            pages: pages
          ),
          quantity: item.quantity
        )
      }
    }.flatMap { $0 }

    let payload = Lulu.Api.CreatePrintJobBody(
      shippingLevel: order.shippingLevel.lulu,
      shippingAddress: order.address.lulu,
      contactEmail: "jared@netrivet.com",
      externalId: order.id.rawValue.uuidString,
      lineItems: lineItems
    )
    return try await Current.luluClient.createPrintJob(payload)
  }

  struct ExploratoryItem: Equatable, Codable {
    let volumes: NonEmpty<[Int]>
    let printSize: PrintSize
    let quantity: Int
  }

  struct ExploratoryMetadata: Codable, Sendable, Equatable {
    var shippingLevel: Order.ShippingLevel
    var shipping: Cents<Int>
    var taxes: Cents<Int>
    var fees: Cents<Int>
    var creditCardFeeOffset: Cents<Int>
  }

  static func getExploratoryMetadata(
    for items: [ExploratoryItem],
    shippedTo address: ShippingAddress,
    email: EmailAddress
  ) async throws -> ExploratoryMetadata {
    try await withThrowingTaskGroup(of: (
      Lulu.Api.PrintJobCostCalculationsResponse?,
      Order.ShippingLevel
    ).self) { group -> ExploratoryMetadata in
      for level in Order.ShippingLevel.allCases {
        group.addTask {
          do {
            let output = try await Current.luluClient.createPrintJobCostCalculation(
              address.lulu,
              level.lulu,
              items.flatMap { item in
                item.volumes.map { pages in
                  .init(
                    pageCount: pages,
                    podPackageId: Lulu.podPackageId(size: item.printSize, pages: pages),
                    quantity: item.quantity
                  )
                }
              }
            )
            return (output, level)
          } catch {
            let errorString = String(describing: error)
            if !errorString.contains("No shipping option found") {
              await slackError("""
                Unexpected error from print job ExploratoryMetadata:

                ```
                \(errorString)
                ```

                Items:

                ```
                "\(JSON.encode(items, .pretty) ?? String(describing: items))"
                ```

                Address:

                ```
                email: \(email)
                "\(JSON.encode(address, .pretty) ?? String(describing: address))"
                ```
              """)
            }
            return (nil, level)
          }
        }
      }

      var results: [(Lulu.Api.PrintJobCostCalculationsResponse, Order.ShippingLevel)] = []
      for try await (res, level) in group {
        if let res {
          results.append((res, level))
        }
      }

      try results.sort { a, b in
        guard let aTotal = Double(a.0.totalCostInclTax) else {
          throw Error.invalidMoneyStringFromApi(a.0.totalCostInclTax)
        }
        guard let bTotal = Double(b.0.totalCostInclTax) else {
          throw Error.invalidMoneyStringFromApi(b.0.totalCostInclTax)
        }
        return aTotal < bTotal
      }

      guard let (cheapest, level) = results.first else {
        Task { await slackError("shipping not possible: \(email), \(address)") }
        throw Error.noExploratoryMetadataRetrieved
      }

      return try ExploratoryMetadata(
        shippingLevel: level,
        shipping: toCents(cheapest.shippingCost.totalCostExclTax),
        taxes: toCents(cheapest.totalTax),
        fees: toCents(cheapest.fulfillmentCost.totalCostExclTax),
        creditCardFeeOffset: creditCardFeeOffset(toCents(cheapest.totalCostInclTax))
      )
    }
  }

  static func creditCardFeeOffset(_ desiredNet: Cents<Int>) throws -> Cents<Int> {
    if desiredNet <= 0 {
      throw Error.invalidInputForCreditCardFeeOffset
    }
    let withFlatFee = desiredNet.rawValue + STRIPE_FLAT_FEE
    let percentageOffset = calculatePercentageOffset(withFlatFee)
    return .init(rawValue: STRIPE_FLAT_FEE + percentageOffset)
  }

  enum Error: Swift.Error, LocalizedError {
    case noExploratoryMetadataRetrieved
    case invalidMoneyStringFromApi(String)
    case invalidInputForCreditCardFeeOffset
    case unexpectedMissingEditionImpression(Order.Id, Edition.Id)

    var errorDescription: String? {
      switch self {
      case .noExploratoryMetadataRetrieved:
        return "No exploratory metadata could be retrieved. Very likely shipping was not possible."
      case .invalidMoneyStringFromApi(let value):
        return "Could not convert API currency string value (\(value)) to cents."
      case .invalidInputForCreditCardFeeOffset:
        return "Invalid negative or zero amount for calculating credit card offset."
      case .unexpectedMissingEditionImpression(let orderId, let editionId):
        return "Unexpected missing edition impression for edition \(editionId) in order \(orderId)."
      }
    }
  }
}

// helpers

private func toCents(_ string: String) throws -> Cents<Int> {
  guard let dollars = Double(string) else {
    throw PrintJobs.Error.invalidMoneyStringFromApi(string)
  }
  return .init(rawValue: Int(dollars * 100))
}

private let STRIPE_FLAT_FEE = 30
private let STRIPE_PERCENTAGE = 0.029

private func calculatePercentageOffset(_ amount: Int, _ carry: Int = 0) -> Int {
  let offset = (Double(amount) * STRIPE_PERCENTAGE).rounded(.toNearestOrAwayFromZero)
  if offset == 0.0 {
    return carry
  }
  return calculatePercentageOffset(Int(offset), carry + Int(offset))
}
