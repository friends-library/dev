// auto-generated, do not edit
import type { Env } from '../types';
import type Result from '../Result';
import type * as P from './pairs';
import Client from '../Client';

export default class DevClient extends Client {
  public constructor(env: Env, getToken: () => string | undefined) {
    super(env, `dev`, getToken);
  }

  public static node(
    process: { argv: string[]; env: Record<string, string | undefined> },
    pattern?: string | undefined,
  ): DevClient {
    return Client.inferNode(DevClient, process, pattern);
  }

  public static web(href: string, getToken: () => string | undefined): DevClient {
    return Client.inferWeb(DevClient, href, getToken);
  }

  public async coverWebAppFriends(
    input: P.CoverWebAppFriends.Input,
  ): Promise<P.CoverWebAppFriends.Output> {
    const result = await this.query<P.CoverWebAppFriends.Output>(
      input,
      `CoverWebAppFriends`,
    );
    return result.unwrap();
  }

  public async createArtifactProductionVersion(
    input: P.CreateArtifactProductionVersion.Input,
  ): Promise<P.CreateArtifactProductionVersion.Output> {
    const result = await this.query<P.CreateArtifactProductionVersion.Output>(
      input,
      `CreateArtifactProductionVersion`,
    );
    return result.unwrap();
  }

  public async deleteEntities(
    input: P.DeleteEntities.Input,
  ): Promise<P.DeleteEntities.Output> {
    const result = await this.query<P.DeleteEntities.Output>(input, `DeleteEntities`);
    return result.unwrap();
  }

  public async dpcEditions(input: P.DpcEditions.Input): Promise<P.DpcEditions.Output> {
    const result = await this.query<P.DpcEditions.Output>(input, `DpcEditions`);
    return result.unwrap();
  }

  public async editorDocumentMap(
    input: P.EditorDocumentMap.Input,
  ): Promise<P.EditorDocumentMap.Output> {
    const result = await this.query<P.EditorDocumentMap.Output>(
      input,
      `EditorDocumentMap`,
    );
    return result.unwrap();
  }

  public async getAudios(input: P.GetAudios.Input): Promise<P.GetAudios.Output> {
    const result = await this.query<P.GetAudios.Output>(input, `GetAudios`);
    return result.unwrap();
  }

  public async getEdition(input: P.GetEdition.Input): Promise<P.GetEdition.Output> {
    const result = await this.query<P.GetEdition.Output>(input, `GetEdition`);
    return result.unwrap();
  }

  public async getEditionImpression(
    input: P.GetEditionImpression.Input,
  ): Promise<P.GetEditionImpression.Output> {
    const result = await this.query<P.GetEditionImpression.Output>(
      input,
      `GetEditionImpression`,
    );
    return result.unwrap();
  }

  public async latestArtifactProductionVersion(
    input: P.LatestArtifactProductionVersion.Input,
  ): Promise<P.LatestArtifactProductionVersion.Output> {
    const result = await this.query<P.LatestArtifactProductionVersion.Output>(
      input,
      `LatestArtifactProductionVersion`,
    );
    return result.unwrap();
  }

  public async replaceEditionChapters(
    input: P.ReplaceEditionChapters.Input,
  ): Promise<P.ReplaceEditionChapters.Output> {
    const result = await this.query<P.ReplaceEditionChapters.Output>(
      input,
      `ReplaceEditionChapters`,
    );
    return result.unwrap();
  }

  public async updateAudio(input: P.UpdateAudio.Input): Promise<P.UpdateAudio.Output> {
    const result = await this.query<P.UpdateAudio.Output>(input, `UpdateAudio`);
    return result.unwrap();
  }

  public async updateAudioPart(
    input: P.UpdateAudioPart.Input,
  ): Promise<P.UpdateAudioPart.Output> {
    const result = await this.query<P.UpdateAudioPart.Output>(input, `UpdateAudioPart`);
    return result.unwrap();
  }

  public async upsertEditionImpression(
    input: P.UpsertEditionImpression.Input,
  ): Promise<P.UpsertEditionImpression.Output> {
    const result = await this.query<P.UpsertEditionImpression.Output>(
      input,
      `UpsertEditionImpression`,
    );
    return result.unwrap();
  }

  public coverWebAppFriendsResult(
    input: P.CoverWebAppFriends.Input,
  ): Promise<Result<P.CoverWebAppFriends.Output>> {
    return this.query<P.CoverWebAppFriends.Output>(input, `CoverWebAppFriends`);
  }

  public createArtifactProductionVersionResult(
    input: P.CreateArtifactProductionVersion.Input,
  ): Promise<Result<P.CreateArtifactProductionVersion.Output>> {
    return this.query<P.CreateArtifactProductionVersion.Output>(
      input,
      `CreateArtifactProductionVersion`,
    );
  }

  public deleteEntitiesResult(
    input: P.DeleteEntities.Input,
  ): Promise<Result<P.DeleteEntities.Output>> {
    return this.query<P.DeleteEntities.Output>(input, `DeleteEntities`);
  }

  public dpcEditionsResult(
    input: P.DpcEditions.Input,
  ): Promise<Result<P.DpcEditions.Output>> {
    return this.query<P.DpcEditions.Output>(input, `DpcEditions`);
  }

  public editorDocumentMapResult(
    input: P.EditorDocumentMap.Input,
  ): Promise<Result<P.EditorDocumentMap.Output>> {
    return this.query<P.EditorDocumentMap.Output>(input, `EditorDocumentMap`);
  }

  public getAudiosResult(input: P.GetAudios.Input): Promise<Result<P.GetAudios.Output>> {
    return this.query<P.GetAudios.Output>(input, `GetAudios`);
  }

  public getEditionImpressionResult(
    input: P.GetEditionImpression.Input,
  ): Promise<Result<P.GetEditionImpression.Output>> {
    return this.query<P.GetEditionImpression.Output>(input, `GetEditionImpression`);
  }

  public getEditionResult(
    input: P.GetEdition.Input,
  ): Promise<Result<P.GetEdition.Output>> {
    return this.query<P.GetEdition.Output>(input, `GetEdition`);
  }

  public latestArtifactProductionVersionResult(
    input: P.LatestArtifactProductionVersion.Input,
  ): Promise<Result<P.LatestArtifactProductionVersion.Output>> {
    return this.query<P.LatestArtifactProductionVersion.Output>(
      input,
      `LatestArtifactProductionVersion`,
    );
  }

  public replaceEditionChaptersResult(
    input: P.ReplaceEditionChapters.Input,
  ): Promise<Result<P.ReplaceEditionChapters.Output>> {
    return this.query<P.ReplaceEditionChapters.Output>(input, `ReplaceEditionChapters`);
  }

  public updateAudioPartResult(
    input: P.UpdateAudioPart.Input,
  ): Promise<Result<P.UpdateAudioPart.Output>> {
    return this.query<P.UpdateAudioPart.Output>(input, `UpdateAudioPart`);
  }

  public updateAudioResult(
    input: P.UpdateAudio.Input,
  ): Promise<Result<P.UpdateAudio.Output>> {
    return this.query<P.UpdateAudio.Output>(input, `UpdateAudio`);
  }

  public upsertEditionImpressionResult(
    input: P.UpsertEditionImpression.Input,
  ): Promise<Result<P.UpsertEditionImpression.Output>> {
    return this.query<P.UpsertEditionImpression.Output>(input, `UpsertEditionImpression`);
  }
}
