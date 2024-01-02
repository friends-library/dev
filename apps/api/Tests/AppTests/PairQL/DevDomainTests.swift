import DuetSQL
import XCTest
import XExpect

@testable import App

final class DevDomainTests: AppTestCase {
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
    let edition = (await Entities.create()).edition
    let newId = EditionImpression.Id()

    let output = try await UpsertEditionImpression.resolve(
      with: .init(
        id: newId,
        editionId: edition.id,
        adocLength: 3333,
        paperbackSizeVariant: .xl,
        paperbackVolumes: [233],
        publishedRevision: "a499db17511b75407a1229447946138481d05dd6",
        productionToolchainRevision: "a499db17511b75407a1229447946138481d05dd5"
      ),
      in: .authed
    )

    expect(output.id).toEqual(newId)
  }
}

extension Token {
  static func allScopes() async -> Token {
    let token = try! await Token.create(.init(description: "@testing"))
    let scope = try! await TokenScope.create(.init(tokenId: token.id, scope: .all))
    token.scopes = .loaded([scope])
    return token
  }
}

extension AuthedContext {
  static var authed: Self {
    get async {
      let token = await Token.allScopes()
      return .init(requestId: UUID().uuidString, scopes: token.scopes.require())
    }
  }
}
