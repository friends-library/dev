// auto-generated, do not edit

export namespace AudiobooksPage {
  export type Input = `en` | `es`;

  export type Output = Array<{
    slug: string;
    title: string;
    htmlShortTitle: string;
    editionType: `updated` | `original` | `modernized`;
    isbn: string;
    customCss?: string;
    customHtml?: string;
    isCompilation: boolean;
    friendName: string;
    friendSlug: string;
    friendGender: `male` | `female` | `mixed`;
    duration: string;
    shortDescription: string;
    createdAt: ISODateString;
  }>;
}
