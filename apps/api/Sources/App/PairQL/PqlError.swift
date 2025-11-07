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
    statusCode: Int? = nil,
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
      case .notFound: 404
      case .badRequest: 400
      case .serverError: 500
      case .unauthorized: 401
      }
    }
  }
}

protocol PqlErrorConvertible: Error {
  func pqlError(in: some ResolverContext) -> PqlError
}

extension DuetSQLError: PqlErrorConvertible {
  func pqlError(in context: some ResolverContext) -> PqlError {
    switch self {
    case .notFound(let modelType):
      context.error(
        id: "8271f8a1",
        type: .notFound,
        detail: "DuetSQL: \(modelType) not found",
      )
    case .decodingFailed:
      context.error(
        id: "e3e62901",
        type: .serverError,
        detail: "DuetSQL model decoding failed",
      )
    case .emptyBulkInsertInput:
      context.error(
        id: "db45b1d0",
        type: .serverError,
        detail: "DuetSQL: empty bulk insert input",
      )
    case .invalidEntity:
      context.error(
        id: "7a20146d",
        type: .serverError,
        detail: "DuetSQL: invalid entity",
      )
    case .missingExpectedColumn(let column):
      context.error(
        id: "df128649",
        type: .serverError,
        detail: "DuetSQL: missing expected column `\(column)`",
      )
    case .nonUniformBulkInsertInput:
      context.error(
        id: "e125265d",
        type: .serverError,
        detail: "DuetSQL: non-uniform bulk insert input",
      )
    case .notImplemented(let fn):
      context.error(
        id: "b4e22229",
        type: .serverError,
        detail: "DuetSQL: not implemented `\(fn)`",
      )
    case .tooManyResultsForDeleteOne:
      context.error(
        id: "45557557",
        type: .serverError,
        detail: "DuetSQL: too many results for delete one",
      )
    }
  }
}
