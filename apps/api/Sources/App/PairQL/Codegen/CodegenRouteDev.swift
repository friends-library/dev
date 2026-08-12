import PairQL

extension CodegenRoute.Dev: CodegenRouteHandler {
  static var sharedTypes: [(String, Any.Type)] {
    [
      ("EditionImpression", GetEditionImpression.Output.self),
    ]
  }

  static var pairqlPairs: [any Pair.Type] {
    [
      CreateArtifactProductionVersion.self,
      CoverWebAppFriends.self,
      DeleteEntities.self,
      DpcEditions.self,
      EditorDocumentMap.self,
      GetAudios.self,
      GetEdition.self,
      GetEditionImpression.self,
      LatestArtifactProductionVersion.self,
      ReplaceEditionChapters.self,
      UpdateAudio.self,
      UpdateAudioPart.self,
      UpsertEditionImpression.self,
    ]
  }
}
