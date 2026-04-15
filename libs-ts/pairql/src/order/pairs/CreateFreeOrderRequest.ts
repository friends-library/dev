// auto-generated, do not edit

export namespace CreateFreeOrderRequest {
  export interface Input {
    name: string;
    email: string;
    requestedBooks: string;
    aboutRequester: string;
    addressStreet: string;
    addressStreet2?: string;
    addressCity: string;
    addressState: string;
    addressZip: string;
    addressCountry: string;
    recipientTaxId?: string;
    source: string;
  }

  export type Output = void;
}
