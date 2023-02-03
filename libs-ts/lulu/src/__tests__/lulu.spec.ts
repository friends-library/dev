import { describe, expect, test } from '@jest/globals';
import { price, podPackageId } from '../';
import { PrintSize } from '@friends-library/types';

describe(`podPackageId()`, () => {
  const cases: [PrintSize, number, string][] = [
    [`s`, 31, `0425X0687BWSTDSS060UW444GXX`],
    [`s`, 32, `0425X0687BWSTDPB060UW444GXX`],
    [`s`, 33, `0425X0687BWSTDPB060UW444GXX`],
    [`m`, 187, `0550X0850BWSTDPB060UW444GXX`],
    [`xl`, 525, `0600X0900BWSTDPB060UW444GXX`],
  ];

  test.each(cases)(`size: \`%s\` and pages: \`%d\` -> \`%s\``, (size, pages, id) => {
    expect(podPackageId(size, pages)).toBe(id);
  });
});

describe(`price()`, () => {
  const priceCases: [number, PrintSize, number[]][] = [
    [214, `s`, [10]],
    [265, `s`, [100]],
    [265, `m`, [100]],
    [405, `m`, [200]],
    [685, `xl`, [400]],
  ];

  test.each(priceCases)(
    `.price() is %d for size: %s, pages: %d`,
    (expectedPrice, printSize, numPages) => {
      expect(price(printSize, numPages)).toBe(expectedPrice);
    },
  );
});
