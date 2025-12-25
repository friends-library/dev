// auto-generated, do not edit
import type { ExploratoryMetadata, ShippingAddress } from '../shared';

export namespace GetPrintJobExploratoryMetadata {
  export interface Input {
    items: Array<{
      volumes: [number, ...number[]];
      printSize: `s` | `m` | `xl`;
      quantity: number;
    }>;
    email: string;
    address: ShippingAddress;
    lang: `en` | `es`;
  }

  export type Output =
    | {
        case: `success`;
        metadata: ExploratoryMetadata;
      }
    | {
        case: `shippingAddressError`;
        message: string;
      }
    | {
        case: `shippingNotPossible`;
      };
}
