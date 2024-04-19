import Duet
import Fluent

struct NativeAppError: Codable, Sendable {
  var id: Id
  var buildSemver: String
  var buildNumber: Int
  var lang: Lang
  var detail: String
  var platform: String
  var installId: String
  var errorMessage: String?
  var errorStack: String?
  var createdAt = Current.date()

  var isValid: Bool { true }

  init(
    id: Id = .init(),
    buildSemver: String,
    buildNumber: Int,
    lang: Lang,
    detail: String,
    platform: String,
    installId: String,
    errorMessage: String? = nil,
    errorStack: String? = nil
  ) {
    self.id = id
    self.buildSemver = buildSemver
    self.buildNumber = buildNumber
    self.lang = lang
    self.detail = detail
    self.platform = platform
    self.installId = installId
    self.errorMessage = errorMessage
    self.errorStack = errorStack
  }
}

extension NativeAppError {
  enum M35 {
    static let tableName = "native_app_errors"
    nonisolated(unsafe) static let buildSemver = FieldKey("build_semver")
    nonisolated(unsafe) static let buildNumber = FieldKey("build_number")
    nonisolated(unsafe) static let lang = FieldKey("lang")
    nonisolated(unsafe) static let detail = FieldKey("detail")
    nonisolated(unsafe) static let platform = FieldKey("platform")
    nonisolated(unsafe) static let installId = FieldKey("install_id")
    nonisolated(unsafe) static let errorMessage = FieldKey("error_message")
    nonisolated(unsafe) static let errorStack = FieldKey("error_stack")
  }
}
