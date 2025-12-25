// auto-generated, do not edit

export namespace OrderEditions {
  export type Input = void;

  export type Output = Array<{
    id: UUID;
    type: `updated` | `original` | `modernized`;
    title: string;
    shortTitle: string;
    author: string;
    lang: `en` | `es`;
    priceInCents: number;
    paperbackSize: `s` | `m` | `xl`;
    paperbackVolumes: [number, ...number[]];
    smallImgUrl: string;
    largeImgUrl: string;
  }>;
}
