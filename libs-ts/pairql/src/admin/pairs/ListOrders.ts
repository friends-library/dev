// auto-generated, do not edit

export namespace ListOrders {
  export type Input = void;

  export type Output = Array<{
    id: UUID;
    amountInCents: number;
    addressName: string;
    printJobStatus:
      | `presubmit`
      | `pending`
      | `accepted`
      | `rejected`
      | `shipped`
      | `canceled`
      | `bricked`;
    source: `website` | `internal`;
    createdAt: ISODateString;
  }>;
}
