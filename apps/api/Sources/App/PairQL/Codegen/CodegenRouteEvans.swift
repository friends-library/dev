import PairQL

extension CodegenRoute.Evans: CodegenRouteHandler {
  static var sharedTypes: [(String, Any.Type)] {
    []
  }

  static var pairqlPairs: [any Pair.Type] {
    [
      LogJsError.self,
      SubmitContactForm.self,
      SubscribeToNarrowPath.self,
    ]
  }
}
