extension Friend {
  func isValid() async -> Bool {
    if !name.firstLetterIsUppercase {
      logInvalid("Name does not start with uppercase letter")
      return false
    }

    if !slug.match("^[a-z][a-z0-9-]+$") {
      logInvalid("Slug is invalid")
      return false
    }

    if gender == .mixed, !isCompilations {
      logInvalid("Gender is mixed but friend is not a compilation")
      return false
    }

    if description.containsUnpresentableSubstring {
      logInvalid("Description contains unpresentable substring")
      return false
    }

    if outOfBand {
      return true
    }

    if description.count < 50, published != nil {
      logInvalid("Description is too short to publish")
      return false
    }

    if let joined = try? await joined(),
       published == nil,
       joined.hasNonDraftDocument {
      logInvalid("Friend is unpublished but has a non-draft document")
      return false
    }

    if isCompilations, born != nil || died != nil {
      logInvalid("Compilation friend has born or died year set")
      return false
    }

    if died == nil, !isCompilations {
      logInvalid("Died year is not set")
      return false
    }

    if let died, let born, died - born < 15 {
      logInvalid("Died year is less than 15 years after born year")
      return false
    }

    if born?.isValidEarlyQuakerYear == false || died?.isValidEarlyQuakerYear == false {
      logInvalid("Born or died year is not a valid early Quaker year")
      return false
    }

    if let joined = try? await joined() {
      if published == nil, joined.hasNonDraftDocument {
        logInvalid("Friend is unpublished but has a non-draft document")
        return false
      }

      let sorted = joined.quotes.sorted { $0.order < $1.order }
      var prev = 0
      for quote in sorted {
        if quote.order != prev + 1 {
          logInvalid("Quote order is not sequential")
          return false
        }
        prev = quote.order
      }
    }

    return true
  }
}

private func logInvalid(_ message: String) {
  get(dependency: \.logger).warning("Invalid friend: \(message)")
}
