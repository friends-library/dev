import { describe, expect, test } from 'vitest';
import type { PrintSize } from '@friends-library/types';
import { price, podPackageId } from '../';

describe(`podPackageId()`, () => {
  const cases: [PrintSize, number, string][] = [
    [`s`, 31, `0425X0687.BW.STD.SS.060UW444.GXX`],
    [`s`, 32, `0425X0687.BW.STD.PB.060UW444.GXX`],
    [`s`, 33, `0425X0687.BW.STD.PB.060UW444.GXX`],
    [`m`, 187, `0550X0850.BW.STD.PB.060UW444.GXX`],
    [`xl`, 525, `0600X0900.BW.STD.PB.060UW444.GXX`],
  ];

  test.each(cases)(`size: \`%s\` and pages: \`%d\` -> \`%s\``, (size, pages, id) => {
    expect(podPackageId(size, pages)).toBe(id);
  });
});

describe(`price()`, () => {
  const priceCases: [number, PrintSize, number[]][] = [
    [401, `s`, [10]],
    [447, `s`, [100]],
    [447, `m`, [100]],
    [696, `m`, [200]],
    [1195, `xl`, [400]],
  ];

  test.each(priceCases)(
    `.price() is %d for size: %s, pages: %d`,
    (expectedPrice, printSize, numPages) => {
      expect(price(printSize, numPages)).toBe(expectedPrice);
    },
  );
});
