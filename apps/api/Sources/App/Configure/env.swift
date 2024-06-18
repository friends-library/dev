import Rainbow
import Vapor

typealias Env = Vapor.Environment

extension Configure {
  static func env(_ app: Application) {
    Env.mode = .init(from: app.environment)
    guard Env.mode != .test else {
      return
    }

    Current.logger = app.logger
    Current.logger.notice("\("[,]".magenta.bold) API environment is \(Env.mode.coloredName)")

    if Env.mode == .dev {
      Current.logger.notice("Connected to database `\(Env.DATABASE_NAME)`")
    }
  }
}

// extensions

extension Vapor.Environment {

  // SAFETY: only set in this file during initial sync configuration of app
  // before app starts handling requests on other threads
  // long-term it would be better to handle this differently
  fileprivate(set) nonisolated(unsafe) static var mode = Mode.dev

  enum Mode: Equatable {
    case prod
    case dev
    case staging
    case test

    init(from env: Env) {
      switch env.name {
      case "production":
        self = .prod
      case "development":
        self = .dev
      case "staging":
        self = .staging
      case "testing":
        self = .test
      default:
        fatalError("Unexpected environment: \(env.name)")
      }
    }

    var name: String {
      switch self {
      case .prod:
        return "production"
      case .dev:
        return "development"
      case .staging:
        return "staging"
      case .test:
        return "testing"
      }
    }

    var coloredName: String {
      switch self {
      case .prod:
        return name.uppercased().red.bold
      case .dev:
        return name.uppercased().green.bold
      case .staging:
        return name.uppercased().yellow.bold
      case .test:
        return name.uppercased().magenta.bold
      }
    }
  }
}

extension Vapor.Environment {
  static let PG_DUMP_PATH = get("PG_DUMP_PATH")!
  static let POSTMARK_API_KEY = get("POSTMARK_API_KEY")!
  static let SLACK_API_TOKEN_WORKSPACE_MAIN = get("SLACK_API_TOKEN_WORKSPACE_MAIN")!
  static let SLACK_API_TOKEN_WORKSPACE_BOT = get("SLACK_API_TOKEN_WORKSPACE_BOT")!
  static let DATABASE_NAME = get("DATABASE_NAME")!
  static let DATABASE_USERNAME = get("DATABASE_USERNAME")!
  static let DATABASE_PASSWORD = get("DATABASE_PASSWORD")!
  static let CLOUD_STORAGE_BUCKET_URL = get("CLOUD_STORAGE_BUCKET_URL")!
  static let LULU_API_ENDPOINT = get("LULU_API_ENDPOINT")!
  static let LULU_CLIENT_KEY = get("LULU_CLIENT_KEY")!
  static let LULU_CLIENT_SECRET = get("LULU_CLIENT_SECRET")!
  static let LULU_PHONE_NUMBER = get("LULU_PHONE_NUMBER")!
  static let STRIPE_PUBLISHABLE_KEY = get("STRIPE_PUBLISHABLE_KEY")!
  static let STRIPE_SECRET_KEY = get("STRIPE_SECRET_KEY")!
  static let JARED_CONTACT_FORM_EMAIL = get("JARED_CONTACT_FORM_EMAIL")!
  static let JASON_CONTACT_FORM_EMAIL = get("JASON_CONTACT_FORM_EMAIL")!
  static let PARSE_USERAGENT_BIN = get("PARSE_USERAGENT_BIN")!
  static let NODE_BIN = get("NODE_BIN")!
  static let LOCATION_API_KEY = get("LOCATION_API_KEY")!
  static let DEEPL_API_KEY = get("DEEPL_API_KEY")!
  static let MAPBOX_API_KEY = get("MAPBOX_API_KEY")!
  static let SELF_URL = get("SELF_URL")!
  static let WEBSITE_URL_EN = get("WEBSITE_URL_EN")!
  static let WEBSITE_URL_ES = get("WEBSITE_URL_ES")!
}
