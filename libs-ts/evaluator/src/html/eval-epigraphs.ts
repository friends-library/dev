import { traverse } from '@friends-library/parser';
import type { DocumentNode, Visitor } from '@friends-library/parser';
import type { Lang } from '@friends-library/types';
import { joinTokens, chapterMarkup as c } from '../utils';
import PrimitivesVisitor from './PrimitivesVisitor';

export default function evalEpigraphs(document: DocumentNode, lang: Lang): string {
  if (document.epigraphs.children.length === 0) {
    return ``;
  }

  const output: Array<string[]> = [];
  traverse(document.epigraphs, visitor, output, { target: `pdf`, lang });
  return (output[0] || []).join(`\n`);
}

const visitor: Visitor<Array<string[]>, { target: `pdf`; lang: Lang }> = {
  collection: {
    enter({ output }) {
      c.reset();
      output.push(c.get());
      c.push(`<div class="epigraphs own-page">`);
    },
    exit() {
      c.push(`</div>`);
    },
  },

  block: {
    enter({ index }) {
      c.push(`<div class="epigraph${index > 0 ? ` epigraph--not-first` : ``}">`);
      c.push(`<span class="epigraph__text">`);
    },

    exit({ node }) {
      c.push(`</span>`);
      c.push(
        `<span class="epigraph__source">${joinTokens(
          node.context?.quoteSource ?? [],
        )}</span>`,
      );
      c.push(`</div>`);
    },
  },

  ...PrimitivesVisitor,
};
