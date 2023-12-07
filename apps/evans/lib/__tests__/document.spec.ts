import { describe, test, it, expect, beforeEach } from 'vitest';
import { documentDate } from '../document';

describe(`documentDate()`, () => {
  let book: Parameters<typeof documentDate>[0];

  beforeEach(() => {
    book = { slug: ``, isCompilation: false };
  });

  it(`should use published date when present`, () => {
    book.publishedYear = 1710;
    book.friendDied = 1733;
    expect(documentDate(book)).toBe(1710);
  });

  it(`should use death date for a friend who lived to be less than 31`, () => {
    book.friendBorn = 1700;
    book.friendDied = 1725;
    expect(documentDate(book)).toBe(1725);
  });

  it(`should guess 10 years less than death if we only have a death date`, () => {
    book.friendDied = 1740;
    expect(documentDate(book)).toBe(1730);
  });

  it(`should use 75% of age`, () => {
    book.friendBorn = 1700;
    book.friendDied = 1800;
    expect(documentDate(book)).toBe(1775);
  });

  test(`compilations can have no determinable date`, () => {
    book.isCompilation = true;
    expect(documentDate(book)).toBe(-1);
  });

  test(`non compilations should throw if no date can be found`, () => {
    expect(() => documentDate(book)).toThrow();
  });
});
