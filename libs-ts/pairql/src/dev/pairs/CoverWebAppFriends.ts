// auto-generated, do not edit

export namespace CoverWebAppFriends {
  export type Input = void;

  export type Output = Array<{
    name: string;
    alphabeticalName: string;
    description: string;
    documents: Array<{
      lang: `en` | `es`;
      title: string;
      isCompilation: boolean;
      directoryPath: string;
      description: string;
      editions: Array<{
        id: UUID;
        path: string;
        isDraft: boolean;
        type: `updated` | `original` | `modernized`;
        pages?: [number, ...number[]];
        size?: `s` | `m` | `xl`;
        isbn?: string;
        audioPartTitles?: string[];
      }>;
    }>;
  }>;
}
