import { PrintSize } from '@friends-library/types';
import { PrintSizeDetails } from './types';

export { PrintSizeDetails };

const defaultMargins = {
  top: 0.85,
  bottom: 0.65,
  outer: 0.6,
  inner: 0.7,
  runningHeadTop: 0.35,
};

export function price(size: PrintSize, pages: number[]): number {
  return pages.reduce((sum, volPages) => {
    const isSaddleStitch = size === `s` && volPages < 32;
    const basePrice = isSaddleStitch ? 200 : 125;
    return sum + basePrice + Math.round(volPages * PRICE_PER_PAGE);
  }, 0);
}

export function bookDims(
  size: PrintSize,
  numPages: number,
): { width: number; height: number; depth: number } {
  return {
    ...sizes[size].dims,
    depth: numPages * (1 / PAGES_PER_INCH),
  };
}

export function podPackageId(printSize: PrintSize, numPages: number): string {
  const dimensions = {
    s: `0425X0687`,
    m: `0550X0850`,
    xl: `0600X0900`,
  };

  return [
    dimensions[printSize],
    `BW`, // interior color
    `STD`, // standard quality
    numPages < 32 ? `SS` : `PB`, // saddle-stitch || perfect bound
    `060UW444`, // 60# uncoated white paper, bulk = 444 pages/inch
    `G`, // glossy cover (`M`: matte)
    `X`, // no linen,
    `X`, // no foil
  ].join(``);
}

export const sizes: { [K in PrintSize]: PrintSizeDetails } = {
  s: {
    luluName: `Pocket Book`,
    abbrev: `s`,
    minPages: 2,
    maxPages: 175,
    margins: {
      top: 0.68,
      bottom: 0.52,
      outer: 0.48,
      inner: 0.528,
      runningHeadTop: 0.18,
    },
    dims: {
      height: 6.875,
      width: 4.24,
    },
  },
  m: {
    minPages: 100,
    maxPages: 450,
    luluName: `Digest`,
    abbrev: `m`,
    margins: defaultMargins,
    dims: {
      height: 8.5,
      width: 5.5,
    },
  },
  xl: {
    minPages: 350,
    maxPages: 720,
    luluName: `US Trade`,
    abbrev: `xl`,
    margins: defaultMargins,
    dims: {
      height: 9,
      width: 6,
    },
  },
};

export function getPrintSizeDetails(id: string): PrintSizeDetails {
  let size;

  Object.values(sizes).forEach((s) => {
    if (s && (s.luluName === id || s.abbrev === id)) {
      size = s;
    }
  });

  if (!size) {
    throw new Error(`Unknown print size identifier: "${id}"`);
  }

  return size;
}

export const PAGES_PER_INCH = 444;
const PRICE_PER_PAGE = 1.4;
