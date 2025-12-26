import type { Visitor, AstNode } from '@friends-library/parser';
import { wrap, chapterMarkup as c } from '../utils';

const FootnoteVisitor: Visitor<Array<string[]>, { target: `pdf` | `ebook` }> = {
  blockInFootnote: {
    dispatch({ node, context }) {
      if (!node.isPoetryBlock()) {
        throw new Error(`Unexpected block type within footnote.`);
      }
      return isEbook(context) ? {} : wrap(`span`, [`poetry`]);
    },
  },

  paragraphInFootnote: {
    dispatch({ context }) {
      if (isEbook(context)) return {};
      return wrap((n) => (n.hasSiblings() ? `span` : null), [`footnote-paragraph`]);
    },
  },

  footnote: {
    dispatch({ context, node }) {
      if (!isEbook(context)) {
        return wrap(`span`, [`footnote`]);
      }

      const [num, marker] = ebookFootnoteData(node, false);
      return {
        enter() {
          c.push(footnoteCallMarkup(num, marker, `notes`));
          c.pause();
        },
        exit() {
          c.unpause();
        },
      };
    },
  },
};

export default FootnoteVisitor;

export function ebookFootnoteData(
  footnote: AstNode,
  helperNoteAlreadyPrepended = false,
): [number: number, marker: string, file: string] {
  const document = footnote.document();
  const footnotes = document.footnotes.children;
  let numFootnotes = footnotes.length;
  let index = footnotes.indexOf(footnote);

  if (!helperNoteAlreadyPrepended) {
    index += 1;
    numFootnotes += 1;
  }

  const number = index + 1;
  const marker = footnoteMarker(numFootnotes, index);
  const file = footnote.getMetaData(`isFootnoteHelper`)
    ? `footnote-helper`
    : `chapter-${document.chapters.indexOf(footnote.chapter) + 1}`;

  return [number, marker, file];
}

export function footnoteMarker(numTotalFootnotes: number, footnoteIndex: number): string {
  const number = footnoteIndex + 1;
  let marker = String(number);
  if (numTotalFootnotes < 5 && footnoteIndex <= 3) {
    marker = [`§`, `*`, `†`, `‡`][footnoteIndex] ?? ``;
  }
  return marker;
}

function isEbook(context: { target: `pdf` | `ebook` }): boolean {
  return context.target === `ebook`;
}

export function footnoteCallMarkup(num: number, marker: string, file: string): string {
  return [
    `<sup class="footnote" id="fn-call__${num}">`,
    `<a href="${file}.xhtml#fn__${num}" title="View footnote.">${marker}</a>`,
    `</sup>`,
  ].join(`\n`);
}
