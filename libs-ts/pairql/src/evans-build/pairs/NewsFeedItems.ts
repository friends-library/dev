// auto-generated, do not edit

export namespace NewsFeedItems {
  export type Input = `en` | `es`;

  export type Output = Array<{
    kind:
      | {
          case: `spanishTranslation`;
          isCompilation: boolean;
          friendName: string;
          englishHtmlShortTitle: string;
        }
      | {
          case: `book`;
        }
      | {
          case: `audiobook`;
        };
    htmlShortTitle: string;
    documentSlug: string;
    friendSlug: string;
    createdAt: ISODateString;
  }>;
}
