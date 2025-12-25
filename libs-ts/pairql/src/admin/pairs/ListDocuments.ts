// auto-generated, do not edit

export namespace ListDocuments {
  export type Input = void;

  export type Output = Array<{
    id: UUID;
    title: string;
    friend: {
      id: UUID;
      name: string;
      alphabeticalName: string;
      lang: `en` | `es`;
    };
  }>;
}
