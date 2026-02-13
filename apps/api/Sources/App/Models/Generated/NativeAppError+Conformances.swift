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
      .id(self)
    case .buildSemver:
      .string(buildSemver)
    case .buildNumber:
      .int(buildNumber)
    case .lang:
      .enum(lang)
    case .detail:
      .string(detail)
    case .platform:
      .string(platform)
    case .installId:
      .string(installId)
    case .errorMessage:
      .string(errorMessage)
    case .errorStack:
      .string(errorStack)
    case .createdAt:
      .date(createdAt)
    }
  }
}

extension NativeAppError {
  typealias ColumnName = CodingKeys

  enum CodingKeys: String, CodingKey, CaseIterable, ModelColumns {
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
