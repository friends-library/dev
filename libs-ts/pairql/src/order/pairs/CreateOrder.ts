// auto-generated, do not edit
import type { ShippingLevel } from '../shared';

export namespace CreateOrder {
  export interface Input {
    id?: UUID;
    lang: 'en' | 'es';
    source: 'website' | 'internal';
    paymentId: string;
    amount: number;
    taxes: number;
    fees: number;
    ccFeeOffset: number;
    shipping: number;
    shippingLevel: ShippingLevel;
    email: string;
    addressName: string;
    addressStreet: string;
    addressStreet2?: string;
    addressCity: string;
    addressState: string;
    addressZip: string;
    addressCountry: string;
    freeOrderRequestId?: UUID;
    items: Array<{
      editionId: UUID;
      quantity: number;
      unitPrice: number;
    }>;
  }

  export type Output = UUID;
}
