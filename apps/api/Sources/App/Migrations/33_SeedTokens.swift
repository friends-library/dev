import Fluent
import Vapor

struct Seeded {
  struct Tokens {
    let queryDownloads = UUID(uuidString: "ECB4BC53-5F37-4D9D-BB3C-2256386FECD9")!
    let queryOrders = UUID(uuidString: "FCBF1F83-E771-4BA5-8DC3-137322793BE5")!
    let mutateDownloads = UUID(uuidString: "A957D4BC-F172-4A65-9E70-FFE06B5A1484")!
    let mutateOrders = UUID(uuidString: "3410A02F-156C-4EE4-8145-2D7EBCD4885E")!
    let mutateArtifactProductionVersions = UUID(uuidString: "C23BD372-AC46-4005-B612-78B23BCADEF9")!
    let allScopes = UUID(uuidString: "AB9E8FCA-BA51-4E7E-B5D1-00D9269503AE")!
  }

  static let tokens = Tokens()
}

struct SeedTokens: AsyncMigration {
  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: SeedTokens UP")

    guard Env.get("SEED_DB") == "true" || Env.mode == .test else {
      return
    }

    let tokens: [UUID: (String, [Scope])] = [
      Seeded.tokens.queryDownloads: ("queryDownloads", [.queryDownloads]),
      Seeded.tokens.mutateDownloads: ("mutateDownloads", [.mutateDownloads]),
      Seeded.tokens.queryOrders: ("queryOrders", [.queryOrders]),
      Seeded.tokens.mutateOrders: ("mutateOrders", [.mutateOrders]),
      Seeded.tokens.mutateArtifactProductionVersions: (
        "mutateArtifactProductionVersions",
        [.mutateArtifactProductionVersions]
      ),
      Seeded.tokens.allScopes: ("allScopes", [.all]),
    ]

    for (tokenValue, (description, scopes)) in tokens {
      var token = Token(value: .init(rawValue: tokenValue), description: description)
      token.scopes = .loaded(scopes.map { TokenScope(tokenId: token.id, scope: $0) })
      try await Current.db.create(token)
      for tokenScope in token.scopes.require() {
        try await Current.db.create(tokenScope)
      }
    }
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: SeedTokens DOWN")
  }
}
