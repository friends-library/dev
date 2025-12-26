// auto-generated, do not edit

export namespace DpcEditions {
  export type Input = void;

  export type Output = Array<{
    id: UUID;
    type: `updated` | `original` | `modernized`;
    editor?: string;
    directoryPath: string;
    paperbackSplits?: number[];
    isbn?: string;
    document: {
      title: string;
      originalTitle?: string;
      description: string;
      slug: string;
      published?: number;
    };
    friend: {
      isCompilations: boolean;
      name: string;
      alphabeticalName: string;
      slug: string;
      lang: `en` | `es`;
    };
  }>;
}
