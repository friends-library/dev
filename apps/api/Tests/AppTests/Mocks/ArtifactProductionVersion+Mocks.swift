@testable import App

extension ArtifactProductionVersion {
  static var mock: ArtifactProductionVersion {
    ArtifactProductionVersion(version: "@mock version")
  }

  static var empty: ArtifactProductionVersion {
    ArtifactProductionVersion(version: "")
  }

  static var random: ArtifactProductionVersion {
    ArtifactProductionVersion(version: .init(rawValue: "@random".random))
  }

  static var mockOld: ArtifactProductionVersion {
    var model: ArtifactProductionVersion = .mock
    model.createdAt = .init(subtractingDays: 3)
    return model
  }
}
