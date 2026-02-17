import Dependencies
import DuetSQL
import Queues
import Vapor

public struct VerifyEntityValidityJob: AsyncScheduledJob {
  @Dependency(\.db) var db

  public func run(context: QueueContext) async throws {
    do {
      try await self.checkModelsValidity(
        ArtifactProductionVersion.self,
        "ArtifactProductionVersion",
      )
      try await self.checkModelsValidity(DocumentTag.self, "DocumentTag")
      try await self.checkModelsValidity(Document.self, "Document")
      try await self.checkModelsValidity(Audio.self, "Audio")
      try await self.checkModelsValidity(AudioPart.self, "AudioPart")
      try await self.checkModelsValidity(EditionChapter.self, "EditionChapter")
      try await self.checkModelsValidity(EditionImpression.self, "EditionImpression")
      try await self.checkModelsValidity(Edition.self, "Edition")
      try await self.checkModelsValidity(Friend.self, "Friend")
      try await self.checkModelsValidity(FriendQuote.self, "FriendQuote")
      try await self.checkModelsValidity(FriendResidence.self, "FriendResidence")
      try await self.checkModelsValidity(FriendResidenceDuration.self, "FriendResidenceDuration")
      try await self.checkModelsValidity(Isbn.self, "Isbn")
      try await self.checkModelsValidity(RelatedDocument.self, "RelatedDocument")
      try await self.checkModelsValidity(NPQuote.self, "NPQuote")
      try await self.verifyAltLanguageDocumentsPaired()
      await slackDebug("Finished running `VerifyEntityValidityJob`")
    } catch {
      await slackError("Error verifying entity validity: \(String(describing: error))")
    }
  }

  func checkModelsValidity(_ Model: (some ApiModel).Type, _ name: String) async throws {
    let models = try await Model.query().all(in: self.db)
    for model in models {
      if await model.isValid() == false {
        await slackError("\(name) `\(model.id.uuidString.lowercased())` found in invalid state")
      }
    }
  }

  func verifyAltLanguageDocumentsPaired() async throws {
    let documents = try await Document.query().all(in: self.db)
    for document in documents {
      if let altId = document.altLanguageId {
        let altDoc = try await self.db.find(altId)
        if altDoc.altLanguageId != document.id {
          await slackError("Document \(document.id.lowercased) alt lang doc not properly paired")
        }
      }
    }
  }
}
