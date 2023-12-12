import { describe, test, it, expect } from 'vitest';
import { episodeTitle, episodeDescription, subtitle } from '../podcast';

describe(`subtitle()`, () => {
  const cases: Array<[Parameters<typeof subtitle>, string]> = [
    [
      [
        {
          reader: `Jason R. Henderson`,
          title: `A Letter of Elizabeth Webb`,
          isCompilation: false,
          friendName: `Elizabeth Webb`,
        },
        `en`,
      ],
      `Audiobook of Elizabeth Webb's "A Letter of Elizabeth Webb" from The Friends Library. Read by Jason R. Henderson.`,
    ],
    [
      [
        {
          reader: `Keren Alvaredo`,
          title: `La Carta de Elizabeth Webb`,
          isCompilation: false,
          friendName: `Elizabeth Webb`,
        },
        `es`,
      ],
      `Audiolibro de "La Carta de Elizabeth Webb" escrito por Elizabeth Webb, de la Biblioteca de los Amigos. Leído por Keren Alvaredo.`,
    ],
    [
      [
        {
          reader: `Jason R. Henderson`,
          title: `Truth in the Inward Parts -- Volume 1`,
          isCompilation: true,
          friendName: `Compilations`,
        },
        `en`,
      ],
      `Audiobook of "Truth in the Inward Parts -- Volume 1" from The Friends Library. Read by Jason R. Henderson.`,
    ],
    [
      [
        {
          reader: `Keren Alvaredo`,
          title: `La Verdad en Lo Íntimo`,
          isCompilation: true,
          friendName: `Compilaciones`,
        },
        `es`,
      ],
      `Audiolibro de "La Verdad en Lo Íntimo", de la Biblioteca de los Amigos. Leído por Keren Alvaredo.`,
    ],
  ];

  test.each(cases)(`subtitle`, (args, expected) => {
    expect(subtitle(...args)).toBe(expected);
  });
});

describe(`episodeTitle()`, () => {
  it(`should use full title for standalone audio part`, () => {
    expect(episodeTitle(`A Letter of Elizabeth Webb`, 1, 1)).toBe(
      `A Letter of Elizabeth Webb`,
    );
  });

  it(`it should append short part identifier to title for multi-part audio`, () => {
    expect(episodeTitle(`Saved to the Uttermost`, 1, 5)).toBe(
      `Saved to the Uttermost, pt. 1`,
    );
  });
});

describe(`episodeDescription()`, () => {
  const cases: Array<[Parameters<typeof episodeDescription>, string]> = [
    [
      [
        { title: `A Letter of Elizabeth Webb`, friendName: `Elizabeth Webb` },
        `The Life of Elizabeth Webb`,
        1,
        1,
        `en`,
      ],
      `Audiobook version of "A Letter of Elizabeth Webb" by Elizabeth Webb`,
    ],
    [
      [
        { title: `La Carta de Elizabeth Webb`, friendName: `Elizabeth Webb` },
        `La Carta de Elizabeth Webb`,
        1,
        1,
        `es`,
      ],
      `Audiolibro de "La Carta de Elizabeth Webb" escrito por Elizabeth Webb`,
    ],
    [
      [
        {
          title: `Los Escritos de Isaac Penington -- Volumen 1`,
          friendName: `Isaac Penington`,
        },
        `Capítulo 1`,
        1,
        19,
        `es`,
      ],
      `Cp. 1. Parte 1 de 19 del audiolibro de "Los Escritos de Isaac Penington -- Volumen 1" escrito por Isaac Penington`,
    ],
    [
      [
        { title: `Saved to the Uttermost`, friendName: `Robert Barclay` },
        `Chapter 1 - The Condition of Man in the Fall`,
        1,
        6,
        `en`,
      ],
      `Ch. 1 - The Condition of Man in the Fall. Part 1 of 6 of the audiobook version of "Saved to the Uttermost" by Robert Barclay`,
    ],
  ];

  test.each(cases)(`episodeDescription()`, (args, expected) => {
    expect(episodeDescription(...args)).toBe(expected);
  });

  it(`should not prepend \`part x\` if that is the audio part title`, () => {
    expect(
      episodeDescription(
        { title: `Walk in the Spirit`, friendName: `Hugh Turford` },
        `Part 1`,
        1,
        3,
        `en`,
      ),
    ).toBe(
      `Part 1 of 3 of the audiobook version of "Walk in the Spirit" by Hugh Turford`,
    );
  });
});
