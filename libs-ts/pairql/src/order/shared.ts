// auto-generated, do not edit

export interface ExploratoryMetadata {
  shippingLevel: ShippingLevel;
  shipping: number;
  taxes: number;
  fees: number;
  creditCardFeeOffset: number;
}

export interface ShippingAddress {
  name: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  recipientTaxId?: string;
}

export type ShippingLevel =
  | 'mail'
  | 'priorityMail'
  | 'groundHd'
  | 'groundBus'
  | 'ground'
  | 'expedited'
  | 'express';
