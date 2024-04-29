import Fluent

extension TokenScope {
  enum M5 {
    static let tableName = "token_scopes"
    static let dbEnumName = "scopes"
    static let scope = FieldKey("scope")
    static let tokenId = FieldKey("token_id")
    enum Scope {
      static let queryDownloads = "queryDownloads"
      static let mutateDownloads = "mutateDownloads"
      static let queryOrders = "queryOrders"
      static let mutateOrders = "mutateOrders"
    }
  }

  enum M9 {
    enum Scope {
      static let mutateArtifactProductionVersions = "mutateArtifactProductionVersions"
    }
  }
}
