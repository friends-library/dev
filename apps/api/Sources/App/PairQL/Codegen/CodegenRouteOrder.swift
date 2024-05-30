import PairQL

extension CodegenRoute.Order: CodegenRouteHandler {
  static var sharedTypes: [(String, Any.Type)] {
    [
      ("ShippingAddress", ShippingAddress.self),
      ("ShippingLevel", Order.ShippingLevel.self),
      ("ExploratoryMetadata", PrintJobs.ExploratoryMetadata.self),
    ]
  }

  static var pairqlPairs: [any Pair.Type] {
    [
      BrickOrder.self,
      CreateOrder.self,
      CreateFreeOrderRequest.self,
      GetPrintJobExploratoryMetadata.self,
      LogJsError.self,
      InitOrder.self,
      SendOrderConfirmationEmail.self,
    ]
  }
}
