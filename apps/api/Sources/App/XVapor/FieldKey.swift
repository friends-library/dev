import Fluent

public extension FieldKey {
  init(_ stringLiteral: String) {
    self.init(stringLiteral: stringLiteral)
  }

  // todo concurrency
  nonisolated(unsafe) static let createdAt = FieldKey("created_at")
  nonisolated(unsafe) static let updatedAt = FieldKey("updated_at")
  nonisolated(unsafe) static let deletedAt = FieldKey("deleted_at")
}
