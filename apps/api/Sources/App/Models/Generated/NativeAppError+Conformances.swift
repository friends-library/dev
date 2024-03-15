import DuetSQL
import Tagged

extension NativeAppError: ApiModel {
  typealias Id = Tagged<NativeAppError, UUID>
}

extension NativeAppError: Model {
  static let tableName = M35.tableName

  func postgresData(for column: ColumnName) -> Postgres.Data {
    switch column {
    case .id:
      return .id(self)
    case .buildSemver:
      return .string(buildSemver)
    case .buildNumber:
      return .int(buildNumber)
    case .lang:
      return .enum(lang)
    case .detail:
      return .string(detail)
    case .platform:
      return .string(platform)
    case .installId:
      return .string(installId)
    case .errorMessage:
      return .string(errorMessage)
    case .errorStack:
      return .string(errorStack)
    case .createdAt:
      return .date(createdAt)
    }
  }
}

extension NativeAppError {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable {
    case id
    case buildSemver
    case buildNumber
    case lang
    case detail
    case platform
    case installId
    case errorMessage
    case errorStack
    case createdAt
  }
}

extension NativeAppError {
  var insertValues: [ColumnName: Postgres.Data] {
    [
      .id: .id(self),
      .buildSemver: .string(buildSemver),
      .buildNumber: .int(buildNumber),
      .lang: .enum(lang),
      .detail: .string(detail),
      .platform: .string(platform),
      .installId: .string(installId),
      .errorMessage: .string(errorMessage),
      .errorStack: .string(errorStack),
      .createdAt: .currentTimestamp,
    ]
  }
}
