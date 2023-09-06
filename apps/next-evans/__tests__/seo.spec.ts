import { documentPageDescription, friendPageDescription } from '../lib/seo';
import { describe, it, expect } from 'vitest';

describe(`friendPageDescription()`, () => {
  it(`works for single book without audiobook`, () => {
    expect(
      friendPageDescription(
        `Abel Thomas`,
        [{ title: `The Life of Abel Thomas`, hasAudio: false }],
        `A description.`,
      ),
    ).toEqual(
      `Free ebook by early Quaker writer Abel Thomas: “The Life of Abel Thomas.” Download as MOBI, EPUB, PDF, or order a low-cost paperback. A description.`,
    );
  });

  it(`works for multiple books without audiobook`, () => {
    expect(
      friendPageDescription(
        `Abel Thomas`,
        [
          { title: `The Life of Abel Thomas`, hasAudio: false },
          { title: `How to Become Good`, hasAudio: false },
        ],
        `A description.`,
      ),
    ).toEqual(
      `Free ebooks by early Quaker writer Abel Thomas: “The Life of Abel Thomas,” “How to Become Good.” Download as MOBI, EPUB, PDF, or order a low-cost paperback. A description.`,
    );
  });

  it(`works for single book with audiobook`, () => {
    expect(
      friendPageDescription(
        `Abel Thomas`,
        [{ title: `The Life of Abel Thomas`, hasAudio: true }],
        `A description.`,
      ),
    ).toEqual(
      `Free ebook and audiobook by early Quaker writer Abel Thomas: “The Life of Abel Thomas.” Download as MOBI, EPUB, PDF, listen to a Podcast, MP3s, M4B, or order a low-cost paperback. A description.`,
    );
  });

  it(`works for multiple books with audiobooks`, () => {
    expect(
      friendPageDescription(
        `Abel Thomas`,
        [
          { title: `The Life of Abel Thomas`, hasAudio: true },
          { title: `How to Become Good`, hasAudio: true },
        ],
        `A description.`,
      ),
    ).toEqual(
      `Free ebooks and audiobooks by early Quaker writer Abel Thomas: “The Life of Abel Thomas,” “How to Become Good.” Download as MOBI, EPUB, PDF, listen to a Podcast, MP3s, M4B, or order a low-cost paperback. A description.`,
    );
  });
});

describe(`documentPageDescription()`, () => {
  it(`works without audiobook`, () => {
    expect(
      documentPageDescription(
        `Pearls from the Deep`,
        `Job Scott`,
        false,
        `Here is the blurb.`,
      ),
    ).toEqual(
      `Free complete ebook of “Pearls from the Deep” by Job Scott, an early member of the Religious Society of Friends (Quakers). Download as MOBI, EPUB, PDF, or order a low-cost paperback. Here is the blurb.`,
    );
  });

  it(`works with audiobook`, () => {
    expect(
      documentPageDescription(
        `Pearls from the Deep`,
        `Job Scott`,
        true,
        `Here is the blurb.`,
      ),
    ).toEqual(
      `Free complete ebook and audiobook of “Pearls from the Deep” by Job Scott, an early member of the Religious Society of Friends (Quakers). Download as MOBI, EPUB, PDF, listen to a Podcast, MP3s, M4B, or order a low-cost paperback. Here is the blurb.`,
    );
  });

  it(`works for compilations`, () => {
    expect(
      documentPageDescription(
        `Truth Defended`,
        `Compilations`,
        false,
        `Here is the blurb.`,
      ),
    ).toEqual(
      `Free complete ebook of “Truth Defended”—a compilation written by early members of the Religious Society of Friends (Quakers). Download as MOBI, EPUB, PDF, or order a low-cost paperback. Here is the blurb.`,
    );
  });
});
