import Foundation
import NonEmpty
import XHttp

extension Lulu.Api {

  struct Client {
    var createPrintJob: (CreatePrintJobBody) async throws -> PrintJob
    var listPrintJobs: (NonEmpty<[Int64]>?) async throws -> [PrintJob]
    var getPrintJobStatus: (Int64) async throws -> PrintJob.Status
    var createPrintJobCostCalculation: (
      ShippingAddress,
      ShippingOptionLevel,
      [PrintJobCostCalculationsBody.LineItem]
    ) async throws -> PrintJobCostCalculationResponse
  }
}

extension Lulu.Api.Client {
  static let live: Self = .init(
    createPrintJob: createPrintJob(_:),
    listPrintJobs: listPrintJobs(_:),
    getPrintJobStatus: getPrintJobStatus(id:),
    createPrintJobCostCalculation: printJobCost(address:shippingLevel:items:)
  )
}

extension Lulu.Api.Client {
  static let mock: Self = .init(
    createPrintJob: { _ in .init(id: 1, status: .init(name: .created), lineItems: []) },
    listPrintJobs: { _ in [] },
    getPrintJobStatus: { _ in .init(name: .created) },
    createPrintJobCostCalculation: { _, _, _ in
      .init(
        totalCostInclTax: "0.00",
        totalTax: "0.00",
        shippingCost: .init(totalCostExclTax: "0.00"),
        fees: [.init(totalCostExclTax: "0.00")]
      )
    }
  )
}

// live implementations

private func getPrintJobStatus(id: Int64) async throws -> Lulu.Api.PrintJob.Status {
  try await HTTP.get(
    "\(Env.LULU_API_ENDPOINT)/print-jobs/\(id)/status/",
    decoding: Lulu.Api.PrintJob.Status.self,
    auth: .bearer(try await luluToken.get()),
    keyDecodingStrategy: .convertFromSnakeCase
  )
}

private func listPrintJobs(_ ids: NonEmpty<[Int64]>? = nil) async throws -> [Lulu.Api.PrintJob] {
  var query = ""
  ids.map { query += "?id=" + $0.map(String.init).joined(separator: "&id=") }
  return try await HTTP.get(
    "\(Env.LULU_API_ENDPOINT)/print-jobs/\(query)",
    decoding: Lulu.Api.ListPrintJobsResponse.self,
    auth: .bearer(try await luluToken.get()),
    keyDecodingStrategy: .convertFromSnakeCase
  ).results
}

private func createPrintJob(
  _ body: Lulu.Api.CreatePrintJobBody
) async throws -> Lulu.Api.PrintJob {
  try await postJson(body, to: "print-jobs/", decoding: Lulu.Api.PrintJob.self)
}

private func printJobCost(
  address: Lulu.Api.ShippingAddress,
  shippingLevel: Lulu.Api.ShippingOptionLevel,
  items: [Lulu.Api.PrintJobCostCalculationsBody.LineItem]
) async throws -> Lulu.Api.PrintJobCostCalculationResponse {
  try await postJson(
    Lulu.Api.PrintJobCostCalculationsBody(
      lineItems: items,
      shippingAddress: address,
      shippingOption: shippingLevel
    ),
    to: "print-job-cost-calculations/",
    decoding: Lulu.Api.PrintJobCostCalculationResponse.self
  )
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
    auth: .bearer(try await luluToken.get()),
    keyEncodingStrategy: .convertToSnakeCase,
    keyDecodingStrategy: .convertFromSnakeCase
  )
}
