import DuetSQL

public struct PqlError: Error, Codable, Equatable, Sendable {
  public var id: String
  public var requestId: String
  public var type: Kind
  public var detail: String?
  public var statusCode: Int

  public init(
    id: String,
    requestId: String,
    type: PqlError.Kind,
    detail: String? = nil,
    statusCode: Int? = nil
  ) {
    self.id = id
    self.requestId = requestId
    self.type = type
    self.detail = detail
    self.statusCode = statusCode ?? type.statusCode
  }
}

public extension PqlError {
  enum Kind: String, Codable, CaseIterable, Sendable {
    case notFound
    case badRequest
    case serverError
    case unauthorized

    var statusCode: Int {
      switch self {
      case .notFound: return 404
      case .badRequest: return 400
      case .serverError: return 500
      case .unauthorized: return 401
      }
    }
  }
}

protocol PqlErrorConvertible: Error {
  func pqlError<C: ResolverContext>(in: C) -> PqlError
}

extension DuetSQLError: PqlErrorConvertible {
  func pqlError<C: ResolverContext>(in context: C) -> PqlError {
    switch self {
    case .notFound(let modelType):
      return context.error(
        id: "8271f8a1",
        type: .notFound,
        detail: "DuetSQL: \(modelType) not found"
      )
    case .decodingFailed:
      return context.error(
        id: "e3e62901",
        type: .serverError,
        detail: "DuetSQL model decoding failed"
      )
    case .emptyBulkInsertInput:
      return context.error(
        id: "db45b1d0",
        type: .serverError,
        detail: "DuetSQL: empty bulk insert input"
      )
    case .invalidEntity:
      return context.error(
        id: "7a20146d",
        type: .serverError,
        detail: "DuetSQL: invalid entity"
      )
    case .missingExpectedColumn(let column):
      return context.error(
        id: "df128649",
        type: .serverError,
        detail: "DuetSQL: missing expected column `\(column)`"
      )
    case .nonUniformBulkInsertInput:
      return context.error(
        id: "e125265d",
        type: .serverError,
        detail: "DuetSQL: non-uniform bulk insert input"
      )
    case .notImplemented(let fn):
      return context.error(
        id: "b4e22229",
        type: .serverError,
        detail: "DuetSQL: not implemented `\(fn)`"
      )
    case .tooManyResultsForDeleteOne:
      return context.error(
        id: "45557557",
        type: .serverError,
        detail: "DuetSQL: too many results for delete one"
      )
    }
  }
}
