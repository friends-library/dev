extension Friend {
  var isValid: Bool {
    if !name.firstLetterIsUppercase {
      return false
    }

    if !slug.match("^[a-z][a-z0-9-]+$") {
      return false
    }

    if gender == .mixed, !isCompilations {
      return false
    }

    if description.containsUnpresentableSubstring {
      return false
    }

    if description.count < 50, published != nil {
      return false
    }

    // TODO: sad
    // if case .loaded(let documents) = documents,
    //    documents.allSatisfy(\.editions.isLoaded),
    //    published == nil,
    //    hasNonDraftDocument {
    //   return false
    // }

    // // test for sequential quotes, when loaded
    // if case .loaded(let quotes) = quotes {
    //   let sorted = quotes.sorted { $0.order < $1.order }
    //   var prev = 0
    //   for quote in sorted {
    //     if quote.order != prev + 1 {
    //       return false
    //     }
    //     prev = quote.order
    //   }
    // }

    if isCompilations, born != nil || died != nil {
      return false
    }

    if died == nil, !isCompilations {
      return false
    }

    if let died, let born, died - born < 15 {
      return false
    }

    if born?.isValidEarlyQuakerYear == false || died?.isValidEarlyQuakerYear == false {
      return false
    }

    return true
  }
}
