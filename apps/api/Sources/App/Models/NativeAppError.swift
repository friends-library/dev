import Duet
import Fluent

final class NativeAppError: Codable {
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
    static let buildSemver = FieldKey("build_semver")
    static let buildNumber = FieldKey("build_number")
    static let lang = FieldKey("lang")
    static let detail = FieldKey("detail")
    static let platform = FieldKey("platform")
    static let installId = FieldKey("install_id")
    static let errorMessage = FieldKey("error_message")
    static let errorStack = FieldKey("error_stack")
  }
}
