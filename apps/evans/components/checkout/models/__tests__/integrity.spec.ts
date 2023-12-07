import { describe, test, expect } from 'vitest';
import { isAddress, isItem } from '../integrity';

describe(`isAddress`, () => {
  const cases: [unknown, boolean][] = [
    [null, false],
    [`string`, false],
    [undefined, false],
    [true, false],
    [{}, false],
    [
      {
        name: `Jane`,
        street: `123 Mulberry Lane`,
        city: `New York`,
        state: `NY`,
        zip: `90210`,
        country: `US`,
      },
      true,
    ],
    [
      {
        name: `Jane`,
        street: `123 Mulberry Lane`,
        city: `New York`,
        state: `NY`,
        zip: `90210`,
        country: [`US`],
      },
      false,
    ],
    [
      {
        name: `Jane`,
        street: `123 Mulberry Lane`,
        city: `New York`,
        state: `NY`,
        zip: 90210,
        country: `US`,
      },
      false,
    ],
    [
      {
        name: `Jane`,
        street: `123 Mulberry Lane`,
        street2: `apt #2`,
        city: `New York`,
        state: `NY`,
        zip: `90210`,
        country: `US`,
      },
      true,
    ],
    [
      {
        name: `Jane`,
        street: `123 Mulberry Lane`,
        city: `New York`,
        state: `NY`,
        zip: `90210`,
        country: `US`,
        unusable: false,
      },
      true,
    ],
  ];

  test.each(cases)(`returns correct value`, (input, expected) => {
    expect(isAddress(input)).toBe(expected);
  });
});

describe(`isItem`, () => {
  const cases: [unknown, boolean][] = [
    [null, false],
    [`string`, false],
    [undefined, false],
    [true, false],
    [{}, false],
    [
      {
        edition: `updated`,
        quantity: 3,
        printSize: `xl`,
        numPages: [333],
        displayTitle: `Journal of G. F.`,
        editionId: `the-id`,
        title: `Journal of G. F`,
        author: `G. F.`,
      },
      true,
    ],
    [
      {
        edition: `super-new`,
        quantity: 3,
        printSize: `xl`,
        numPages: [333],
        displayTitle: `Journal of G. F.`,
        editionId: `the-id`,
        title: `Journal of G. F`,
        author: `G. F.`,
      },
      false,
    ],
    [
      {
        edition: `updated`,
        quantity: `3`,
        printSize: `xl`,
        numPages: [333],
        displayTitle: `Journal of G. F.`,
        editionId: `the-id`,
        title: `Journal of G. F`,
        author: `G. F.`,
      },
      false,
    ],
    [
      {
        edition: `updated`,
        quantity: 3,
        printSize: `xxxl`,
        numPages: [333],
        displayTitle: `Journal of G. F.`,
        editionId: `the-id`,
        title: `Journal of G. F`,
        author: `G. F.`,
      },
      false,
    ],
    [
      {
        edition: `updated`,
        quantity: 3,
        printSize: `xl`,
        numPages: 333,
        displayTitle: `Journal of G. F.`,
        editionId: `the-id`,
        title: `Journal of G. F`,
        author: `G. F.`,
      },
      false,
    ],
    [
      {
        edition: `updated`,
        quantity: 3,
        printSize: `xl`,
        numPages: [333],
        editionId: `the-id`,
        title: `Journal of G. F`,
        author: `G. F.`,
      },
      false,
    ],
    [
      {
        edition: `updated`,
        quantity: 3,
        printSize: `xl`,
        numPages: [333],
        displayTitle: `Journal of G. F.`,
        editionId: 333444,
        title: `Journal of G. F`,
        author: `G. F.`,
      },
      false,
    ],
    [
      {
        edition: `updated`,
        quantity: 3,
        printSize: `xl`,
        numPages: [333],
        displayTitle: `Journal of G. F.`,
        documentId: 333444, // <-- legacy
        title: `Journal of G. F`,
        author: `G. F.`,
      },
      false,
    ],
  ];

  test.each(cases)(`returns correct value`, (input, expected) => {
    expect(isItem(input)).toBe(expected);
  });
});
