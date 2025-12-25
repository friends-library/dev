// auto-generated, do not edit
import type { EditionImpression } from '../shared';

export namespace UpsertEditionImpression {
  export interface Input {
    id: UUID;
    editionId: UUID;
    adocLength: number;
    paperbackSizeVariant: `s` | `m` | `xl` | `xlCondensed`;
    paperbackVolumes: number[];
    publishedRevision: string;
    productionToolchainRevision: string;
  }

  export type Output = EditionImpression;
}
