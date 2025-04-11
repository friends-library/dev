import DuetSQL
import XCTest
import XExpect

@testable import App

final class DevDomainTests: AppTestCase, @unchecked Sendable {
  func testLatestRevision() async throws {
    try await ArtifactProductionVersion.create(.init(version: "older"))
    try await ArtifactProductionVersion.create(.init(version: "newer"))

    let output = try await LatestArtifactProductionVersion.resolve(in: .authed)

    expect(output.version).toEqual("newer")
  }

  func testCreateArtifactProductionVersion() async throws {
    try await ArtifactProductionVersion.deleteAll()
    let sha = "d3a484ceb896aadd21adae7cad1a2f6debf05671"

    let output = try await CreateArtifactProductionVersion.resolve(
      with: .init(version: .init(sha)),
      in: .authed
    )

    let retrieved = try? await ArtifactProductionVersion.query()
      .where(.version == sha)
      .first()

    expect(retrieved).not.toBeNil()
    expect(output).toEqual(.init(id: retrieved?.id ?? .init()))
  }

  func testUpsertEditionImpressionCanImmediatelyResolveCloudFiles() async throws {
    let entities = await Entities.create()

    let output = try await UpsertEditionImpression.resolve(
      with: .init(
        id: entities.editionImpression.id,
        editionId: entities.edition.id,
        adocLength: 3333,
        paperbackSizeVariant: .xl,
        paperbackVolumes: [233],
        publishedRevision: "a499db17511b75407a1229447946138481d05dd6",
        productionToolchainRevision: "a499db17511b75407a1229447946138481d05dd5"
      ),
      in: .authed
    )
    expect(output.id).toEqual(entities.editionImpression.id)
    let fetched = try await EditionImpression.find(entities.editionImpression.id)
    expect(fetched.adocLength).toEqual(3333)
  }
}

extension Token {
  static func allScopes() async -> [TokenScope] {
    let token = try! await Token.create(.init(description: "@testing"))
    let scope = try! await TokenScope.create(.init(tokenId: token.id, scope: .all))
    return [scope]
  }
}

extension AuthedContext {
  static var authed: Self {
    get async {
      let scopes = await Token.allScopes()
      return .init(requestId: UUID().lowercased, scopes: scopes)
    }
  }
}
