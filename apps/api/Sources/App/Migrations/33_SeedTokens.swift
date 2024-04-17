import Fluent
import Vapor

struct SeedTokens: AsyncMigration {
  func prepare(on database: Database) async throws {
    Current.logger.info("Running migration: SeedTokens UP")
    // removed this migration
  }

  func revert(on database: Database) async throws {
    Current.logger.info("Running migration: SeedTokens DOWN")
  }
}
