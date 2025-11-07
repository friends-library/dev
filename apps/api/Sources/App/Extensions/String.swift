import Foundation

public extension String {
  func match(_ pattern: String) -> Bool {
    range(of: pattern, options: .regularExpression) != nil
  }

  func replace(_ pattern: String, _ replacement: String) -> String {
    replacingOccurrences(of: pattern, with: replacement, options: .regularExpression)
  }

  var firstLetterIsLowercase: Bool {
    guard let firstLetter = first else { return false }
    return firstLetter.lowercased() == String(firstLetter)
  }

  var firstLetterIsUppercase: Bool {
    guard let firstLetter = first else { return false }
    return firstLetter.uppercased() == String(firstLetter)
  }

  var isValidGitCommitFullSha: Bool {
    count == 40 && self.match(#"^[0-9a-f]+$"#)
  }

  var containsUnpresentableSubstring: Bool {
    contains("'")
      || contains("\"")
      || contains("--")
      || contains("...")
      || contains("+++[")
      || contains("\u{200B}") // zero-width space
      || self.match(#"\bLorem\b"#) // lorem ipsum
  }

  func padLeft(toLength: Int, withPad: String) -> String {
    String(
      String(reversed())
        .padding(toLength: toLength, withPad: withPad, startingAt: 0)
        .reversed(),
    )
  }
}
