// auto-generated, do not edit

export namespace GetOrder {
  export type Input = UUID;

  export interface Output {
    id: UUID;
    printJobStatus:
      | `presubmit`
      | `pending`
      | `accepted`
      | `rejected`
      | `shipped`
      | `canceled`
      | `bricked`;
    printJobId?: number;
    amountInCents: number;
    shippingInCents: number;
    taxesInCents: number;
    ccFeeOffsetInCents: number;
    feesInCents: number;
    paymentId: string;
    email: string;
    lang: `en` | `es`;
    source: `website` | `internal`;
    items: Array<{
      id: UUID;
      quantity: number;
      unitPriceInCents: number;
      edition: {
        type: `updated` | `original` | `modernized`;
        documentTitle: string;
        authorName: string;
        image: {
          width: number;
          height: number;
          url: string;
        };
      };
    }>;
    address: {
      name: string;
      street: string;
      street2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      recipientTaxId?: string;
    };
    createdAt: ISODateString;
  }
}
