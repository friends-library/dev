import DuetSQL
import Foundation
import PairQL

struct GetPrintJobExploratoryMetadata: Pair {
  struct Input: PairInput {
    var items: [PrintJobs.ExploratoryItem]
    var email: EmailAddress
    var address: ShippingAddress
    var lang: Lang
  }

  enum Output: PairOutput {
    case success(metadata: PrintJobs.ExploratoryMetadata)
    case shippingAddressError(PrintJobs.ShippingAddressError)
    case shippingNotPossible
  }
}

// resolver

extension GetPrintJobExploratoryMetadata: Resolver {
  static func resolve(with input: Input, in context: Context) async throws -> Output {
    do {
      switch try await PrintJobs.getExploratoryMetadata(
        for: input.items,
        // codable decode skips initializer normalizing `state` to abbrev
        shippedTo: ShippingAddress(
          name: input.address.name,
          street: input.address.street,
          street2: input.address.street2,
          city: input.address.city,
          state: input.address.state,
          zip: input.address.zip,
          country: input.address.country,
          recipientTaxId: input.address.recipientTaxId,
        ),
        email: input.email,
        lang: input.lang,
      ) {
      case .success(let metadata):
        return .success(metadata: metadata)
      case .failure(let error):
        return .shippingAddressError(error)
      }
    } catch PrintJobs.Error.noExploratoryMetadataRetrieved {
      return .shippingNotPossible
    } catch {
      throw error
    }
  }
}

extension PrintJobs.ExploratoryMetadata: PairOutput {}
extension PrintJobs.ShippingAddressError: PairOutput {}
