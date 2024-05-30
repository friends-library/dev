import Foundation
import NonEmpty
import XHttp

extension Lulu.Api {
  struct Client: Sendable {
    var createPrintJob: @Sendable (CreatePrintJobBody) async throws -> PrintJob
    var listPrintJobs: @Sendable (NonEmpty<[Int64]>?) async throws -> [PrintJob]
    var getPrintJobStatus: @Sendable (Int64) async throws -> PrintJob.Status
    var createPrintJobCostCalculation: @Sendable (
      Lang,
      ShippingAddress,
      ShippingOptionLevel,
      [PrintJobCostCalculationsBody.LineItem]
    ) async throws -> PrintJobCostCalculationsResult
  }
}

extension Lulu.Api.Client {
  static let live: Self = .init(
    createPrintJob: createPrintJob(_:),
    listPrintJobs: listPrintJobs(_:),
    getPrintJobStatus: getPrintJobStatus(id:),
    createPrintJobCostCalculation: printJobCost(lang:address:shippingLevel:items:)
  )
}

extension Lulu.Api.Client {
  static let mock: Self = .init(
    createPrintJob: { _ in .init(id: 1, status: .init(name: .created), lineItems: []) },
    listPrintJobs: { _ in [] },
    getPrintJobStatus: { _ in .init(name: .created) },
    createPrintJobCostCalculation: { _, _, _, _ in
      .success(.init(
        totalCostInclTax: "0.00",
        totalTax: "0.00",
        shippingCost: .init(totalCostExclTax: "0.00"),
        fulfillmentCost: .init(totalCostExclTax: "0.00")
      ))
    }
  )
}

// live implementations

@Sendable private func getPrintJobStatus(id: Int64) async throws -> Lulu.Api.PrintJob.Status {
  try await HTTP.get(
    "\(Env.LULU_API_ENDPOINT)/print-jobs/\(id)/status/",
    decoding: Lulu.Api.PrintJob.Status.self,
    auth: .bearer(try await Lulu.Api.Client.ReusableToken.shared.get()),
    keyDecodingStrategy: .convertFromSnakeCase
  )
}

@Sendable private func listPrintJobs(_ ids: NonEmpty<[Int64]>? = nil) async throws
  -> [Lulu.Api.PrintJob] {
  var query = ""
  ids.map { query += "?id=" + $0.map(String.init).joined(separator: "&id=") }
  return try await HTTP.get(
    "\(Env.LULU_API_ENDPOINT)/print-jobs/\(query)",
    decoding: Lulu.Api.ListPrintJobsResponse.self,
    auth: .bearer(try await Lulu.Api.Client.ReusableToken.shared.get()),
    keyDecodingStrategy: .convertFromSnakeCase
  ).results
}

@Sendable private func createPrintJob(
  _ body: Lulu.Api.CreatePrintJobBody
) async throws -> Lulu.Api.PrintJob {
  try await postJson(body, to: "print-jobs/", decoding: Lulu.Api.PrintJob.self)
}

@Sendable private func printJobCost(
  lang: Lang,
  address: Lulu.Api.ShippingAddress,
  shippingLevel: Lulu.Api.ShippingOptionLevel,
  items: [Lulu.Api.PrintJobCostCalculationsBody.LineItem]
) async throws -> Lulu.Api.PrintJobCostCalculationsResult {
  let data = try await postJson(
    Lulu.Api.PrintJobCostCalculationsBody(
      lineItems: items,
      shippingAddress: address,
      shippingOption: shippingLevel
    ),
    to: "print-job-cost-calculations/"
  )
  let decoder = JSONDecoder()
  decoder.keyDecodingStrategy = .convertFromSnakeCase
  if let jobData = try? decoder
    .decode(Lulu.Api.PrintJobCostCalculationsResponse.self, from: data) {
    return .success(jobData)
  }
  if let shippingError = try? decoder.decode(PrintJobCostCalculationsError.self, from: data) {
    if let first = shippingError.shippingAddress.detail.errors.first?.message {
      if lang == .en { return .shippingAddressError(first) }
      let translation = try? await Current.deeplClient.translate(first, TRANSLATION_CONTEXT)
      return .shippingAddressError(translation ?? first)
    }
    throw MissingShippingErrorDetail(body: String(data: data, encoding: .utf8))
  }
  let body = String(data: data, encoding: .utf8)
  if let body, body.contains("No shipping option found") {
    return .notPossibleForShippingLevel
  }
  throw UnexpectedPrintJobCostError(body: body)
}

// helpers

private func postJson<Body: Encodable, Response: Decodable>(
  _ body: Body,
  to path: String,
  decoding: Response.Type
) async throws -> Response {
  try await HTTP.postJson(
    body,
    to: "\(Env.LULU_API_ENDPOINT)/\(path)",
    decoding: Response.self,
    auth: .bearer(try await Lulu.Api.Client.ReusableToken.shared.get()),
    keyEncodingStrategy: .convertToSnakeCase,
    keyDecodingStrategy: .convertFromSnakeCase
  )
}

private func postJson<Body: Encodable>(
  _ body: Body,
  to path: String
) async throws -> Data {
  let (data, _) = try await HTTP.postJson(
    body,
    to: "\(Env.LULU_API_ENDPOINT)/\(path)",
    auth: .bearer(try await Lulu.Api.Client.ReusableToken.shared.get()),
    keyEncodingStrategy: .convertToSnakeCase
  )
  return data
}

private struct PrintJobCostCalculationsError: Decodable {
  struct ShippingAddress: Decodable {
    var detail: Detail
  }

  struct Detail: Decodable {
    var errors: [Error]
  }

  struct Error: Decodable {
    var message: String
  }

  var shippingAddress: ShippingAddress
}

private struct UnexpectedPrintJobCostError: Error { var body: String? }
private struct MissingShippingErrorDetail: Error { var body: String? }
private let TRANSLATION_CONTEXT =
  "A user entered a shipping address in an online website shopping cart form, but encountered an error caused by a mistake filling out the form."
