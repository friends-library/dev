// auto-generated, do not edit

export namespace GetEdition {
  export type Input = UUID;

  export interface Output {
    type: `updated` | `original` | `modernized`;
    isDraft: boolean;
    allSquareImages: Array<{
      width: number;
      filename: string;
      path: string;
    }>;
    allThreeDImages: Array<{
      width: number;
      filename: string;
      path: string;
    }>;
    impression?: {
      id: UUID;
      adocLength: number;
      paperbackSizeVariant: `s` | `m` | `xl` | `xlCondensed`;
      paperbackSize: `s` | `m` | `xl`;
      paperbackVolumes: number[];
      publishedRevision: string;
      productionToolchainRevision: string;
    };
    documentFilename: string;
  }
}
