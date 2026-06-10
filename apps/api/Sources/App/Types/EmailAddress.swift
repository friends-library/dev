import Foundation

extension EmailAddress {
  /// Trims whitespace and rejects malformed addresses — catches typos and stray
  /// whitespace, not a full RFC 5322 validator.
  func validated(in context: some ResolverContext) throws -> EmailAddress {
    let trimmed = rawValue.trimmingCharacters(in: .whitespacesAndNewlines)
    guard trimmed.match(#"^\S+@\S+\.\S+$"#) else {
      throw context.error(
        id: "b6f2a1c4",
        type: .badRequest,
        detail: "Invalid email address `\(rawValue)`",
      )
    }
    return EmailAddress(rawValue: trimmed)
  }
}
