// auto-generated, do not edit

export namespace HomepageFeaturedBooks {
  export interface Input {
    lang: `en` | `es`;
    slugs: Array<{
      friendSlug: string;
      documentSlug: string;
    }>;
  }

  export type Output = Array<{
    isbn: string;
    title: string;
    htmlShortTitle: string;
    paperbackVolumes: [number, ...number[]];
    customCss?: string;
    customHtml?: string;
    isCompilation: boolean;
    friendName: string;
    friendSlug: string;
    friendGender: `male` | `female` | `mixed`;
    documentSlug: string;
    featuredDescription: string;
  }>;
}
