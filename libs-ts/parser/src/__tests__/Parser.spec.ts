import { describe, test, it, expect } from 'vitest';
import { NODE as n, TOKEN as t } from '../types';
import { assertAllNodesHaveTokens, getParser, parseAdocFile, T } from './helpers';

describe(`Parser.parseContext()`, () => {
  test(`parsing basic context`, () => {
    const parser = getParser(`[.offset]\n`);
    const context = parser.parseContext();
    expect(context?.classList).toMatchObject([`offset`]);
  });
});

describe(`Parser.parse()`, () => {
  it(`can parse a hello-world chapter`, () => {
    const document = parseAdocFile(`
      == Preface

      Hello world
    `);
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.BLOCK,
              children: [
                {
                  type: n.PARAGRAPH,
                  children: [{ type: n.TEXT, value: `Hello world` }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it(`maintains a map of embeddable sections`, () => {
    // an `embeddable section` is a section smaller than a chapter identified by a #id
    const document = parseAdocFile(`
      == Preface

      Hello world

      // vvvvvvvv---- context with id on h3 makes the section "embeddable"
      [#embed-me]
      === Appendix A

      Goodbye world
    `);
    expect(document.chapters[0]!.children[2]!).toBe(
      document.embeddableSections[`embed-me`],
    );
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      embeddableSections: {
        'embed-me': `[[AstNode]]`,
      },
    });
  });

  it(`maintains a map of cross-reference chapter locations`, () => {
    const document = parseAdocFile(`
      == Preface

      Hello <<note-A,world>>

      == Intro

      Goodbye <<note-B,world>>
    `);
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      idChapterLocations: {
        'note-A__xref_src': 1,
        'note-B__xref_src': 2,
      },
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.BLOCK,
              children: [
                {
                  type: n.PARAGRAPH,
                  children: [
                    { type: n.TEXT, value: `Hello ` },
                    {
                      type: n.XREF,
                      meta: { data: { target: `note-A` } },
                      children: [T.text(`world`)],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: n.CHAPTER,
          children: [
            {
              type: n.HEADING,
              children: [
                { type: n.HEADING_TITLE, children: [{ type: n.TEXT, value: `Intro` }] },
              ],
              meta: { level: 2 },
            },
            {
              type: n.BLOCK,
              children: [
                {
                  type: n.PARAGRAPH,
                  children: [
                    { type: n.TEXT, value: `Goodbye ` },
                    {
                      type: n.XREF,
                      meta: { data: { target: `note-B` } },
                      children: [T.text(`world`)],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test(`buffered parsing does not mess up xref location`, () => {
    const document = parseAdocFile(`
      == Preface

      Howdy.

      == Prologue

      [.embedded-content-document.letter]
      --

      Hello <<note-A,world>>

      --

      == Intro

      Goodbye <<note-B,world>>
    `);

    expect(document.idChapterLocations).toMatchObject({
      'note-A__xref_src': 2,
      'note-B__xref_src': 3,
    });
  });

  it(`can parse a paragraph beginning with a right brace`, () => {
    const document = parseAdocFile(`
      == Preface

      [.offset]
      +++[+++The narration continues...]
    `);

    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.BLOCK,
              children: [
                {
                  type: n.PARAGRAPH,
                  children: [{ type: n.TEXT, value: `[The narration continues...]` }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it(`can parse a chapter with heading starting with a symbol`, () => {
    const document = parseAdocFile(`
      == '\`Tis a Chapter Title

      Hello world
    `);
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            {
              type: n.HEADING,
              children: [
                {
                  type: n.HEADING_TITLE,
                  children: [
                    {
                      type: n.SYMBOL,
                      value: `'\``,
                      meta: { subType: `LEFT_SINGLE_CURLY` },
                    },
                    { type: n.TEXT, value: `Tis a Chapter Title` },
                  ],
                },
              ],
              meta: { level: 2 },
            },
            {
              type: n.BLOCK,
              children: [
                {
                  type: n.PARAGRAPH,
                  children: [{ type: n.TEXT, value: `Hello world` }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it(`can parse a comment line`, () => {
    const document = parseAdocFile(`
      == Preface

      // here is a comment
      Hello world
    `);
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.BLOCK,
              children: [
                {
                  type: n.PARAGRAPH,
                  children: [{ type: n.TEXT, value: `Hello world` }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it(`attaches start and end tokens to nodes`, () => {
    const document = parseAdocFile(`
      == Preface

      Hello world
    `);
    expect(document.startToken).toMatchObject({
      type: t.EQUALS,
      literal: `==`,
      line: 1,
      column: { start: 1, end: 2 },
    });
    expect(document.endToken).toMatchObject({
      type: t.EOD,
      literal: ``,
      line: 3,
      column: { start: 12, end: 12 },
    });

    const chapter = document.children[0]!;
    expect(chapter.startToken).toMatchObject({
      type: t.EQUALS,
      literal: `==`,
      line: 1,
      column: { start: 1, end: 2 },
    });
    expect(chapter.endToken).toMatchObject({
      type: t.TEXT,
      literal: `world`,
      line: 3,
      column: { start: 7, end: 11 },
    });

    const heading = chapter.children[0]!;
    expect(heading.startToken).toMatchObject({
      type: t.EQUALS,
      literal: `==`,
      line: 1,
      column: { start: 1, end: 2 },
    });
    expect(heading.endToken).toMatchObject({
      type: t.TEXT,
      literal: `Preface`,
      line: 1,
      column: { start: 4, end: 10 },
    });

    const headingTitle = heading.children[0]!;
    expect(headingTitle.startToken).toMatchObject({
      type: t.TEXT,
      literal: `Preface`,
      line: 1,
      column: { start: 4, end: 10 },
    });
    expect(headingTitle.endToken).toMatchObject({
      type: t.TEXT,
      literal: `Preface`,
      line: 1,
      column: { start: 4, end: 10 },
    });

    const block = chapter.children[1]!;
    expect(block.startToken).toMatchObject({
      type: t.TEXT,
      literal: `Hello`,
      line: 3,
      column: { start: 1, end: 5 },
    });
    expect(block.endToken).toMatchObject({
      type: t.TEXT,
      literal: `world`,
      line: 3,
      column: { start: 7, end: 11 },
    });

    assertAllNodesHaveTokens(document);
  });

  it(`can handle context on chapter heading`, () => {
    const document = parseAdocFile(`
      [#ch1]
      == Preface

      Hello world
    `);
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          context: { id: `ch1` },
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.BLOCK,
              children: [
                {
                  type: n.PARAGRAPH,
                  children: [{ type: n.TEXT, value: `Hello world` }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it(`can handle section with multiple paragraphs`, () => {
    const document = parseAdocFile(`
      [#ch1]
      == Preface

      Hello world

      Goodbye world
    `);
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          context: { id: `ch1` },
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.BLOCK,
              children: [
                {
                  type: n.PARAGRAPH,
                  children: [{ type: n.TEXT, value: `Hello world` }],
                },
              ],
            },
            {
              type: n.BLOCK,
              children: [
                {
                  type: n.PARAGRAPH,
                  children: [{ type: n.TEXT, value: `Goodbye world` }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it(`can parse a sub-section`, () => {
    const document = parseAdocFile(`
      == Preface

      === Subsection

      Hello world
    `);
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.SECTION,
              meta: { level: 3 },
              children: [
                {
                  type: n.HEADING,
                  children: [
                    {
                      type: n.HEADING_TITLE,
                      children: [{ type: n.TEXT, value: `Subsection` }],
                    },
                  ],
                  meta: { level: 3 },
                },
                {
                  type: n.BLOCK,
                  children: [
                    {
                      type: n.PARAGRAPH,
                      children: [{ type: n.TEXT, value: `Hello world` }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it(`can parse a sections decreasing by one`, () => {
    const document = parseAdocFile(`
      == Preface

      === Level 3

      ==== Level 4

      === Back to level 3

      Hello world
    `);
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.SECTION,
              meta: { level: 3 },
              children: [
                {
                  type: n.HEADING,
                  children: [
                    {
                      type: n.HEADING_TITLE,
                      children: [{ type: n.TEXT, value: `Level 3` }],
                    },
                  ],
                  meta: { level: 3 },
                },
                {
                  type: n.SECTION,
                  meta: { level: 4 },
                  children: [
                    {
                      type: n.HEADING,
                      meta: { level: 4 },
                      children: [
                        {
                          type: n.HEADING_TITLE,
                          children: [{ type: n.TEXT, value: `Level 4` }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: n.SECTION,
              meta: { level: 3 },
              children: [
                {
                  type: n.HEADING,
                  meta: { level: 3 },
                  children: [
                    {
                      type: n.HEADING_TITLE,
                      children: [{ type: n.TEXT, value: `Back to level 3` }],
                    },
                  ],
                },
                {
                  type: n.BLOCK,
                  children: [
                    {
                      type: n.PARAGRAPH,
                      children: [{ type: n.TEXT, value: `Hello world` }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it(`can parse contexts on chapter-level blocks`, () => {
    const document = parseAdocFile(`
      == Preface

      [.offset]
      Hello world
    `);

    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.BLOCK,
              context: { classList: [`offset`] },
              children: [
                {
                  type: n.PARAGRAPH,
                  children: [{ type: n.TEXT, value: `Hello world` }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it(`can parse contexts on sections`, () => {
    const document = parseAdocFile(`
      == Preface

      [.blurb]
      === Subsection

      Hello world
    `);

    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.SECTION,
              meta: { level: 3 },
              context: { classList: [`blurb`] },
              children: [
                {
                  type: n.HEADING,
                  meta: { level: 3 },
                  children: [
                    {
                      type: n.HEADING_TITLE,
                      children: [{ type: n.TEXT, value: `Subsection` }],
                    },
                  ],
                },
                {
                  type: n.BLOCK,
                  children: [
                    {
                      type: n.PARAGRAPH,
                      children: [{ type: n.TEXT, value: `Hello world` }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test(`sub-sections of same level close previous section`, () => {
    const document = parseAdocFile(`
      == Preface

      === Subsection 1

      Hello world

      === Subsection 2

      Hello world
    `);
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.SECTION,
              meta: { level: 3 },
              children: [
                {
                  type: n.HEADING,
                  meta: { level: 3 },
                  children: [
                    {
                      type: n.HEADING_TITLE,
                      children: [{ type: n.TEXT, value: `Subsection 1` }],
                    },
                  ],
                },
                {
                  type: n.BLOCK,
                  children: [
                    {
                      type: n.PARAGRAPH,
                      children: [{ type: n.TEXT, value: `Hello world` }],
                    },
                  ],
                },
              ],
            },
            {
              type: n.SECTION,
              meta: { level: 3 },
              children: [
                {
                  type: n.HEADING,
                  meta: { level: 3 },
                  children: [
                    {
                      type: n.HEADING_TITLE,
                      children: [{ type: n.TEXT, value: `Subsection 2` }],
                    },
                  ],
                },
                {
                  type: n.BLOCK,
                  children: [
                    {
                      type: n.PARAGRAPH,
                      children: [{ type: n.TEXT, value: `Hello world` }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it(`can parse something in a heading`, () => {
    const document = parseAdocFile(`
      == Chapter _emphasis_

      Hello world
    `);
    const heading = document.children[0]!.children[0]!;
    expect(heading.toJSON().children).toMatchObject([
      {
        type: n.HEADING_TITLE,
        children: [
          { type: n.TEXT, value: `Chapter ` },
          { type: n.EMPHASIS, children: [{ type: n.TEXT, value: `emphasis` }] },
        ],
      },
    ]);
  });

  it(`can parse block quote`, () => {
    const document = parseAdocFile(`
      == Preface

      Hello world

      [quote]
      ____
      Here is a quote.
      ____
    `);
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.BLOCK,
              children: [T.paragraph(`Hello world`)],
            },
            {
              type: n.BLOCK,
              children: [T.paragraph(`Here is a quote.`)],
            },
          ],
        },
      ],
    });
  });

  it(`can parse document epigraphs`, () => {
    const document = parseAdocFile(`
      [quote.epigraph, , John 1:1]
      ____
      Epigraph 1
      ____

      [quote.epigraph, , John 1:2]
      ____
      Epigraph 2
      ____

      == Preface

      Hello world
    `);
    expect(document.epigraphs.children).toMatchObject([
      {
        type: n.BLOCK,
        meta: { subType: `quote` },
        context: {
          quoteSource: [
            { literal: `John` },
            { literal: ` ` },
            { literal: `1` },
            { literal: `:` },
            { literal: `1` },
          ],
        },
        children: [
          {
            type: n.PARAGRAPH,
            children: [{ type: n.TEXT, value: `Epigraph 1` }],
          },
        ],
      },
      {
        type: n.BLOCK,
        meta: { subType: `quote` },
        context: {
          quoteSource: [
            { literal: `John` },
            { literal: ` ` },
            { literal: `1` },
            { literal: `:` },
            { literal: `2` },
          ],
        },
        children: [
          {
            type: n.PARAGRAPH,
            children: [{ type: n.TEXT, value: `Epigraph 2` }],
          },
        ],
      },
    ]);
  });

  test(`chapter-synopsis`, () => {
    const document = parseAdocFile(`
      == Preface

      [.chapter-synopsis]
      * Item 1
      * Item 2

      Hello world
    `);

    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.UNORDERED_LIST,
              context: { classList: [`chapter-synopsis`] },
              children: [
                {
                  type: n.LIST_ITEM,
                  children: [{ type: n.TEXT, value: `Item 1` }],
                },
                {
                  type: n.LIST_ITEM,
                  children: [{ type: n.TEXT, value: `Item 2` }],
                },
              ],
            },
            {
              type: n.BLOCK,
              children: [
                {
                  type: n.PARAGRAPH,
                  children: [{ type: n.TEXT, value: `Hello world` }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test(`numbered-groups not nested`, () => {
    const document = parseAdocFile(`
      == Preface

      Hello world

      [.numbered-group]
      ====

      [.numbered]
      First

      [.numbered]
      Second

      ====
    `);

    assertAllNodesHaveTokens(document);
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.BLOCK,
              children: [
                {
                  type: n.PARAGRAPH,
                  children: [{ type: n.TEXT, value: `Hello world` }],
                },
              ],
            },
            {
              type: n.BLOCK,
              children: [
                {
                  type: n.PARAGRAPH,
                  context: { classList: [`numbered`] },
                  children: [{ type: n.TEXT, value: `First` }],
                },
                {
                  type: n.PARAGRAPH,
                  context: { classList: [`numbered`] },
                  children: [{ type: n.TEXT, value: `Second` }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test(`third-level heading inside of numbered group inside of embedded-content-doc`, () => {
    const document = parseAdocFile(`
      == Preface

      [.embedded-content-document]
      --

      [.numbered-group]
      ====

      === Subheading

      [.numbered]
      First

      ====

      --
    `);

    assertAllNodesHaveTokens(document);
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.BLOCK,
              meta: { subType: `open` },
              context: { classList: [`embedded-content-document`] },
              children: [
                {
                  type: n.BLOCK,
                  meta: { subType: `example` },
                  context: { classList: [`numbered-group`] },
                  children: [
                    {
                      type: n.HEADING,
                      children: [
                        {
                          type: n.HEADING_TITLE,
                          children: [{ type: n.TEXT, value: `Subheading` }],
                        },
                      ],
                    },
                    {
                      type: n.PARAGRAPH,
                      context: { classList: [`numbered`] },
                      children: [{ type: n.TEXT, value: `First` }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test(`syllogism inside embedded-doc`, () => {
    const document = parseAdocFile(`
      == Preface

      [.embedded-content-document]
      --

      Hello world

      [.syllogism]
      * Herp
      * Derp

      --
    `);

    assertAllNodesHaveTokens(document);
    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.BLOCK,
              context: { classList: [`embedded-content-document`] },
              meta: { subType: `open` },
              children: [
                {
                  type: n.PARAGRAPH,
                  children: [{ type: n.TEXT, value: `Hello world` }],
                },
                {
                  type: n.UNORDERED_LIST,
                  children: [
                    {
                      type: n.LIST_ITEM,
                      children: [{ type: n.TEXT, value: `Herp` }],
                    },
                    {
                      type: n.LIST_ITEM,
                      children: [{ type: n.TEXT, value: `Derp` }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it(`can parse a chapter after a description list`, () => {
    const chap1 = `
    == Chapter 1

    Foo: bar

    Baz:: bang
    `;

    const chap2 = `
    == Chapter 2

    Hello world
    `;

    const document = parseAdocFile(chap1, chap2);

    expect(document.children).toHaveLength(2);
  });

  test(`footnote nodes are added to document`, () => {
    const document = parseAdocFile(`
      == Chapter 1.footnote:[Howdy]

      Hello world.^
      footnote:[Hello]
    `);

    expect(document.footnotes.children).toHaveLength(2);
  });

  test(`stuff after postscript is not lost`, () => {
    const document = parseAdocFile(`
      == Preface

      [.embedded-content-document.letter]
      --

      Hello world.

      [.signed-section-signature]
      G+++.+++ F.

      [.postscript]
      ====

      The Postscript.

      ====

      [.signed-section-signature]
      G+++.+++ F.

      [.signed-section-context-close]
      London

      --

      [.the-end]
      Finis.
    `);

    expect(document.toJSON()).toMatchObject({
      type: n.DOCUMENT,
      children: [
        {
          type: n.CHAPTER,
          children: [
            T.chapterHeading(`Preface`),
            {
              type: n.BLOCK,
              meta: { subType: `open` },
              ...T.context([`embedded-content-document`, `letter`]),
              children: [
                T.paragraph(`Hello world.`),
                T.paragraph(`G. F.`, [`signed-section-signature`]),
                {
                  type: n.BLOCK,
                  ...T.context([`postscript`]),
                  meta: { subType: `example` },
                  children: [T.paragraph(`The Postscript.`)],
                },
                T.paragraph(`G. F.`, [`signed-section-signature`]),
                T.paragraph(`London`, [`signed-section-context-close`]),
              ],
            },
            {
              type: n.BLOCK,
              ...T.context([`the-end`]),
              children: [T.paragraph(`Finis.`)],
            },
          ],
        },
      ],
    });
  });
});
