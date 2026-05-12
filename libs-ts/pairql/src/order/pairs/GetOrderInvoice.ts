// auto-generated, do not edit
import type { ShippingAddress } from '../shared';

export namespace GetOrderInvoice {
  export type Input = UUID;

  export interface Output {
    id: UUID;
    lang: `en` | `es`;
    source: `website` | `internal`;
    createdAt: ISODateString;
    email: string;
    address: ShippingAddress;
    paymentId: string;
    printJobStatus:
      | `presubmit`
      | `pending`
      | `accepted`
      | `rejected`
      | `shipped`
      | `canceled`
      | `bricked`;
    amountInCents: number;
    shippingInCents: number;
    taxesInCents: number;
    feesInCents: number;
    ccFeeOffsetInCents: number;
    items: Array<{
      title: string;
      authorName: string;
      isbn?: string;
      quantity: number;
      unitPriceInCents: number;
      editionType: `updated` | `original` | `modernized`;
    }>;
  }
}
