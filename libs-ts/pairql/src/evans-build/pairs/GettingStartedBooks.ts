// auto-generated, do not edit

export namespace GettingStartedBooks {
  export interface Input {
    lang: `en` | `es`;
    slugs: Array<{
      friendSlug: string;
      documentSlug: string;
    }>;
  }

  export type Output = Array<{
    title: string;
    slug: string;
    editionType: `updated` | `original` | `modernized`;
    isbn: string;
    customCss?: string;
    customHtml?: string;
    isCompilation: boolean;
    friendName: string;
    friendSlug: string;
    friendGender: `male` | `female` | `mixed`;
    htmlShortTitle: string;
    hasAudio: boolean;
  }>;
}
