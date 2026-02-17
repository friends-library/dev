import Fluent
import Vapor

struct AddShippingLevelGroundBus: AsyncMigration {

  func prepare(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AddShippingLevelGroundBus UP")
    try await addDbEnumCases(
      db: database,
      enumName: Order.M2.ShippingLevelEnum.name,
      newCases: [M16.ShippingLevelEnum.caseGroundBus],
    )
  }

  func revert(on database: Database) async throws {
    get(dependency: \.logger).info("Running migration: AddShippingLevelGroundBus DOWN")
    // I don't think postgres supports deleting enum cases... ¯\_(ツ)_/¯
  }
}

extension AddShippingLevelGroundBus {
  enum M16 {
    enum ShippingLevelEnum {
      static let caseGroundBus = "groundBus"
    }
  }
}
