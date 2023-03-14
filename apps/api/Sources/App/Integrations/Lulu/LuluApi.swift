import Foundation

extension Lulu.Api {
  enum ShippingOptionLevel: String, CaseIterable, Codable, Equatable {
    case mail = "MAIL"
    case priorityMail = "PRIORITY_MAIL"
    case groundHd = "GROUND_HD"
    case groundBus = "GROUND_BUS"
    case ground = "GROUND"
    case expedited = "EXPEDITED"
    case express = "EXPRESS"
  }

  struct CredentialsResponse: Decodable {
    let accessToken: String
    let expiresIn: Double
  }

  struct ShippingAddress: Codable, Equatable {
    let name: String
    let street1: String
    let street2: String?
    let countryCode: String
    let city: String
    let stateCode: String
    let postcode: String
    let phoneNumber: String
  }

  struct PrintJobCostCalculationsBody: Encodable {
    struct LineItem: Encodable {
      let pageCount: Int
      let podPackageId: String
      let quantity: Int
    }

    let lineItems: [LineItem]
    let shippingAddress: ShippingAddress
    let shippingOption: ShippingOptionLevel
  }

  struct PrintJobCostCalculationResponse: Decodable {
    struct ShippingCost: Decodable {
      var totalCostExclTax: String
    }

    struct Fee: Decodable {
      var totalCostExclTax: String
    }

    var totalCostInclTax: String
    var totalTax: String
    var shippingCost: ShippingCost
    var fees: [Fee]
  }

  struct CreatePrintJobBody: Encodable, Equatable {
    struct LineItem: Encodable, Equatable {
      var title: String
      var cover: String
      var interior: String
      var podPackageId: String
      var quantity: Int
    }

    var shippingLevel: ShippingOptionLevel
    var shippingAddress: ShippingAddress
    var contactEmail: String
    var externalId: String?
    var lineItems: [LineItem]
  }

  struct PrintJob: Decodable {
    struct Status: Decodable {
      enum Name: String, Decodable {
        case created = "CREATED"
        case rejected = "REJECTED"
        case unpaid = "UNPAID"
        case paymentInProgress = "PAYMENT_IN_PROGRESS"
        case productionReady = "PRODUCTION_READY"
        case productionDelayed = "PRODUCTION_DELAYED"
        case inProduction = "IN_PRODUCTION"
        case error = "ERROR"
        case shipped = "SHIPPED"
        case canceled = "CANCELED"
      }

      var name: Name
    }

    struct LineItem: Decodable {
      var trackingUrls: [String]?
    }

    var id: Int64
    var status: Status
    var lineItems: [LineItem]
  }

  struct ListPrintJobsResponse: Decodable {
    var results: [PrintJob]
  }
}

extension ShippingAddress {
  var lulu: Lulu.Api.ShippingAddress {
    .init(
      name: name,
      street1: street,
      street2: street2,
      countryCode: country,
      city: city,
      stateCode: state,
      postcode: zip,
      phoneNumber: Env.LULU_PHONE_NUMBER
    )
  }
}

extension Order.ShippingLevel {
  var lulu: Lulu.Api.ShippingOptionLevel {
    switch self {
      case .mail:
        return .mail
      case .priorityMail:
        return .priorityMail
      case .groundHd:
        return .groundHd
      case .groundBus:
        return .groundBus
      case .ground:
        return .ground
      case .expedited:
        return .expedited
      case .express:
        return .express
    }
  }
}
