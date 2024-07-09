import DuetSQL
import Queues
import Vapor

public struct VerifyEntityValidityJob: AsyncScheduledJob {
  public func run(context: QueueContext) async throws {
    do {
      try await checkModelsValidity(ArtifactProductionVersion.self, "ArtifactProductionVersion")
      try await checkModelsValidity(DocumentTag.self, "DocumentTag")
      try await checkModelsValidity(Document.self, "Document")
      try await checkModelsValidity(Audio.self, "Audio")
      try await checkModelsValidity(AudioPart.self, "AudioPart")
      try await checkModelsValidity(EditionChapter.self, "EditionChapter")
      try await checkModelsValidity(EditionImpression.self, "EditionImpression")
      try await checkModelsValidity(Edition.self, "Edition")
      try await checkModelsValidity(Friend.self, "Friend")
      try await checkModelsValidity(FriendQuote.self, "FriendQuote")
      try await checkModelsValidity(FriendResidence.self, "FriendResidence")
      try await checkModelsValidity(FriendResidenceDuration.self, "FriendResidenceDuration")
      try await checkModelsValidity(Isbn.self, "Isbn")
      try await checkModelsValidity(RelatedDocument.self, "RelatedDocument")
      try await checkModelsValidity(NPQuote.self, "NPQuote")
      try await verifyAltLanguageDocumentsPaired()
      await slackDebug("Finished running `VerifyEntityValidityJob`")
    } catch {
      await slackError("Error verifying entity validity: \(String(describing: error))")
    }
  }
}

// helpers

func checkModelsValidity<M: ApiModel>(_ Model: M.Type, _ name: String) async throws {
  let models = try await Model.query().all()
  for model in models {
    if await model.isValid() == false {
      await slackError("\(name) `\(model.id.uuidString.lowercased())` found in invalid state")
    }
  }
}

func verifyAltLanguageDocumentsPaired() async throws {
  let documents = try await Current.db.query(Document.self).all()
  for document in documents {
    if let altId = document.altLanguageId {
      let altDoc = try await Current.db.find(altId)
      if altDoc.altLanguageId != document.id {
        await slackError("Document \(document.id.lowercased) alt lang doc not properly paired")
      }
    }
  }
}
