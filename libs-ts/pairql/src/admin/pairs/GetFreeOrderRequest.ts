// auto-generated, do not edit

export namespace GetFreeOrderRequest {
  export type Input = UUID;

  export interface Output {
    email: string;
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
  }
}
