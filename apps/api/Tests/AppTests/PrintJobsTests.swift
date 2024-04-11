import XCTest
import XExpect

@testable import App

final class PrintJobsTests: AppTestCase {

  func testQueryExploratoryMetadata() async throws {
    let responses = Responses([
      .init(shipping: "9.99", tax: "3.33", total: "19.12", fee: "1.50"),
      .init(shipping: "10.99", tax: "4.33", total: "20.12", fee: "1.50"),
    ])

    Current.luluClient.createPrintJobCostCalculation = { _, _, _ in
      await responses.next()
    }

    var output = try await GetPrintJobExploratoryMetadata.resolve(
      with: .init(
        items: [.init(volumes: .init(55), printSize: .m, quantity: 1)],
        email: "foo@bar",
        address: .mock
      ),
      in: .mock
    )

    output.shippingLevel = .mail // not testing, dependent on order of .allCases

    expect(output).toEqual(.init(
      shippingLevel: .mail,
      shipping: 999,
      taxes: 333,
      fees: 150,
      creditCardFeeOffset: 88
    ))
  }

  func testCreatePrintJob() async throws {
    var payload: Lulu.Api.CreatePrintJobBody!

    Current.luluClient.createPrintJob = {
      payload = $0
      return .init(id: 1, status: .init(name: .created), lineItems: [])
    }

    let entities = await Entities.create()
    let order = Order.random
    var item = OrderItem.random
    item.orderId = order.id
    item.editionId = entities.edition.id
    try await Current.db.create(order)
    try await Current.db.create(item)

    let job = try await PrintJobs.create(order)

    expect(job.id).toEqual(1)

    expect(payload).toEqual(
      .init(
        shippingLevel: order.shippingLevel.lulu,
        shippingAddress: order.address.lulu,
        contactEmail: "jared@netrivet.com",
        externalId: order.id.rawValue.uuidString,
        lineItems: [.init(
          title: entities.document.title,
          cover: entities.editionImpression.files.paperback.cover.first.sourceUrl.absoluteString,
          interior: entities.editionImpression.files.paperback.interior.first.sourceUrl
            .absoluteString,
          podPackageId: Lulu.podPackageId(
            size: entities.editionImpression.paperbackSizeVariant.printSize,
            pages: entities.editionImpression.paperbackVolumes.first
          ),
          quantity: item.quantity
        )]
      )
    )
  }

  func testCreatePrintJobWithFauxVolumes() async throws {
    var payload: Lulu.Api.CreatePrintJobBody!

    Current.luluClient.createPrintJob = {
      payload = $0
      return .init(id: 1, status: .init(name: .created), lineItems: [])
    }

    var entities = await Entities.create()
    entities.editionImpression.paperbackVolumes = .init(123, 234)
    try await entities.editionImpression.save()

    let order = Order.random
    var item = OrderItem.random
    item.orderId = order.id
    item.editionId = entities.edition.id
    try await Current.db.create(order)
    try await Current.db.create(item)

    let job = try await PrintJobs.create(order)

    expect(job.id).toEqual(1)
    expect(payload).toEqual(
      .init(
        shippingLevel: order.shippingLevel.lulu,
        shippingAddress: order.address.lulu,
        contactEmail: "jared@netrivet.com",
        externalId: order.id.rawValue.uuidString,
        lineItems: [
          .init(
            title: entities.document.title + ", vol. 1",
            cover: entities.editionImpression.files.paperback.cover.first.sourceUrl.absoluteString,
            interior: entities.editionImpression.files.paperback.interior.first.sourceUrl
              .absoluteString,
            podPackageId: Lulu.podPackageId(
              size: entities.editionImpression.paperbackSizeVariant.printSize,
              pages: entities.editionImpression.paperbackVolumes.first
            ),
            quantity: item.quantity
          ),
          .init(
            title: entities.document.title + ", vol. 2",
            cover: entities.editionImpression.files.paperback.cover[1].sourceUrl.absoluteString,
            interior: entities.editionImpression.files.paperback.interior[1].sourceUrl
              .absoluteString,
            podPackageId: Lulu.podPackageId(
              size: entities.editionImpression.paperbackSizeVariant.printSize,
              pages: entities.editionImpression.paperbackVolumes.first
            ),
            quantity: item.quantity
          ),
        ]
      )
    )
  }

  func testGetExploratoryMetadata() async throws {
    let responses = Responses([
      .init(shipping: "9.99", tax: "3.33", total: "19.12", fee: "1.50"),
      .init(shipping: "10.99", tax: "4.33", total: "20.12", fee: "1.50"),
    ])

    Current.luluClient.createPrintJobCostCalculation = { _, _, _ in
      await responses.next()
    }

    let meta = try await PrintJobs.getExploratoryMetadata(
      for: [.init(volumes: .init(259), printSize: .m, quantity: 1)],
      shippedTo: .mock, email: "bob@email.com"
    )
    XCTAssertEqual(meta.creditCardFeeOffset, 88)
    XCTAssertEqual(meta.shipping, 999)
    XCTAssertEqual(meta.taxes, 333)
    XCTAssertEqual(meta.fees, 150)
  }

  func testGetExploratoryMetadataSortsCorrectly() async throws {
    let responses = Responses([
      .init(shipping: "10.94", tax: "4.33", total: "76.42", fee: "3.00"), // mail
      .init(shipping: "16.94", tax: "4.69", total: "82.78", fee: "3.00"), // groundBus
      .init(shipping: "31.19", tax: "5.54", total: "97.88", fee: "3.00"), // expedited
      .init(shipping: "16.94", tax: "4.69", total: "82.78", fee: "3.00"), // groundHd
      .init(shipping: "25.44", tax: "5.20", total: "91.79", fee: "3.00"), // priorityMail
      // the below got chosen by the api wrongly, i think because of string sorting
      .init(shipping: "46.44", tax: "6.46", total: "114.05", fee: "3.00"), // express
    ])

    Current.luluClient.createPrintJobCostCalculation = { _, _, _ in
      await responses.next()
    }

    let meta = try await PrintJobs.getExploratoryMetadata(
      for: [.init(volumes: .init(259), printSize: .m, quantity: 1)],
      shippedTo: .mock, email: ""
    )

    XCTAssertEqual(meta.shipping, 1094)
  }

  func testCreditCardFeeOffset() throws {
    let cases = [
      (455, 44),
      (1135, 65),
      (1426, 73),
      (1912, 88),
      (726, 53),
      (13945, 447),
      (4823, 175),
      (24550, 765),
      (41917, 1282),
    ]

    for (input, expected) in cases {
      let actual = try PrintJobs.creditCardFeeOffset(.init(rawValue: input))
      XCTAssertEqual(actual, .init(rawValue: expected))
    }
  }
}

private actor Responses {
  var responses: [Lulu.Api.PrintJobCostCalculationsResponse]

  init(_ responses: [Lulu.Api.PrintJobCostCalculationsResponse]) {
    self.responses = responses
  }

  func next() -> Lulu.Api.PrintJobCostCalculationsResponse {
    if responses.count == 1 { return responses[0] }
    return responses.removeFirst()
  }
}
