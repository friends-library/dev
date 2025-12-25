// auto-generated, do not edit

export namespace FriendsPage {
  export type Input = `en` | `es`;

  export type Output = Array<{
    slug: string;
    gender: `male` | `female` | `mixed`;
    name: string;
    numBooks: number;
    born?: number;
    died?: number;
    primaryResidence: {
      city: string;
      region: string;
    };
    createdAt: ISODateString;
  }>;
}
