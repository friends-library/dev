import DuetSQL
import Foundation
import PairQL

struct GetPrintJobExploratoryMetadata: Pair {
  struct Input: PairInput {
    var items: [PrintJobs.ExploratoryItem]
    var email: EmailAddress
    var address: ShippingAddress
  }

  typealias Output = PrintJobs.ExploratoryMetadata
}

// resolver

extension GetPrintJobExploratoryMetadata: Resolver {
  static func resolve(with input: Input, in context: Context) async throws -> Output {
    do {
      return try await PrintJobs.getExploratoryMetadata(
        for: input.items,
        // codable decode skips initializer normalizing `state` to abbrev
        shippedTo: ShippingAddress(
          name: input.address.name,
          street: input.address.street,
          street2: input.address.street2,
          city: input.address.city,
          state: input.address.state,
          zip: input.address.zip,
          country: input.address.country
        ),
        email: input.email
      )
    } catch PrintJobs.Error.noExploratoryMetadataRetrieved {
      throw context.error(
        id: "53b04a22",
        type: .notFound,
        detail: "Error.noExploratoryMetadataRetrieved: shipping not possible"
      )
    } catch {
      throw error
    }
  }
}

extension PrintJobs.ExploratoryMetadata: PairOutput {}
