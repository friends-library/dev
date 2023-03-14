import Vapor
import XVapor

extension Env {
  static var mode = Mode.dev
  static let PG_DUMP_PATH = get("PG_DUMP_PATH")!
  static let SENDGRID_API_KEY = get("SENDGRID_API_KEY")!
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
  static let MAPBOX_API_KEY = get("MAPBOX_API_KEY")!
  static let SELF_URL = get("SELF_URL")!
  static let WEBSITE_URL_EN = get("WEBSITE_URL_EN")!
  static let WEBSITE_URL_ES = get("WEBSITE_URL_ES")!
}
