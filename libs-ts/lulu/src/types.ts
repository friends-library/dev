import type { PrintSize } from '@friends-library/types';

export interface PrintSizeDetails {
  abbrev: PrintSize;
  maxPages: number;
  minPages: number;
  luluName: `Pocket Book` | `Digest` | `US Trade`;
  dims: {
    height: number;
    width: number;
  };
  margins: {
    top: number;
    bottom: number;
    outer: number;
    inner: number;
    runningHeadTop: number;
  };
}
