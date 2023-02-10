import { PrintSize } from '@friends-library/types';
import { describe, test } from '@jest/globals';
import { choosePrintSize } from '../paperback';

type Params = Parameters<typeof choosePrintSize>;

describe(`choosePrintSize()`, () => {
  const singleCases: Array<[Params[0], [PrintSize, boolean]]> = [
    [
      {
        s: 700,
        m: 600,
        xl: 550,
        'xl--condensed': 530,
      },
      [`xl`, false],
    ],
    [
      {
        s: 900,
        m: 800,
        xl: 750,
        'xl--condensed': 690,
      },
      [`xl`, true],
    ],
    [
      {
        s: 400,
        m: 300,
        xl: 350,
        'xl--condensed': 200,
      },
      [`m`, false],
    ],
    [
      {
        s: 70,
        m: 55,
        xl: 44,
        'xl--condensed': 40,
      },
      [`s`, false],
    ],
  ];

  test.each(singleCases)(
    `non-volumed data should produce correct size and condense`,
    (single, result) => {
      expect(choosePrintSize(single, undefined)).toMatchObject(result);
    },
  );

  const splitCases: [Params[1], [PrintSize, boolean]][] = [
    [
      {
        m: [600, 600],
        xl: [550, 550],
        'xl--condensed': [500, 500],
      },
      [`xl`, false],
    ],
  ];

  test.each(splitCases)(
    `volumed data should produce correct size and condense`,
    (split, result) => {
      const single = { s: 5, m: 5, xl: 5, 'xl--condensed': 5 };
      expect(choosePrintSize(single, split)).toMatchObject(result);
    },
  );
});
