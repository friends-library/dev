extension Friend {
  func isValid() async -> Bool {
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

    if outOfBand {
      return true
    }

    if description.count < 50, published != nil {
      return false
    }

    if let joined = try? await joined(),
       published == nil,
       joined.hasNonDraftDocument {
      return false
    }

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

    if let joined = try? await joined() {
      if published == nil, joined.hasNonDraftDocument {
        return false
      }

      let sorted = joined.quotes.sorted { $0.order < $1.order }
      var prev = 0
      for quote in sorted {
        if quote.order != prev + 1 {
          return false
        }
        prev = quote.order
      }
    }

    return true
  }
}
