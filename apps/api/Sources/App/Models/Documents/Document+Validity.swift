extension Document {
  func isValid() async -> Bool {
    if !title.firstLetterIsUppercase {
      logInvalid("Title does not start with uppercase letter")
      return false
    }

    if !filename.firstLetterIsUppercase {
      logInvalid("Filename does not start with uppercase letter")
      return false
    }

    if title.count < 5 {
      logInvalid("Title is too short")
      return false
    }

    if !slug.match("^[a-z][a-z0-9-]+$") {
      logInvalid("Slug is invalid")
      return false
    }

    if description.containsUnpresentableSubstring {
      logInvalid("Description contains unpresentable substring")
      return false
    }

    if partialDescription.containsUnpresentableSubstring {
      logInvalid("Partial description contains unpresentable substring")
      return false
    }

    if featuredDescription?.containsUnpresentableSubstring == true {
      logInvalid("Featured description contains unpresentable substring")
      return false
    }

    if published?.isValidEarlyQuakerYear == false {
      logInvalid("Published date is not a valid early Quaker year")
      return false
    }

    if let originalTitle = originalTitle {
      if !originalTitle.firstLetterIsUppercase {
        logInvalid("Original title does not start with uppercase letter")
        return false
      }

      if originalTitle.count < 7 {
        logInvalid("Original title is too short")
        return false
      }
    }

    if filename.contains(" ") {
      logInvalid("Filename contains space")
      return false
    }

    guard let joined = try? await joined() else { return true }

    if joined.hasNonDraftEdition {
      if description.count < 5 || partialDescription.count < 5 {
        logInvalid("Description or partial description is too short")
        return false
      }
      if let featured = featuredDescription, featured.count < 5 {
        logInvalid("Featured description is too short")
        return false
      }
    }

    if joined.friend.lang == .en, !filename.match("^[A-Z][A-Za-z0-9_]+$") {
      logInvalid("Filename is invalid (en)")
      return false
    }

    return true
  }
}

private func logInvalid(_ message: String) {
  Current.logger.warning("Invalid document: \(message)")
}
