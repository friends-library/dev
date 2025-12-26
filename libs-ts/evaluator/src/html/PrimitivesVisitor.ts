import type { Visitor } from '@friends-library/parser';
import type { Lang } from '@friends-library/types';
import { utils as u, wrap, chapterMarkup as c } from '../utils';

const PrimitivesVisitor: Visitor<
  Array<string[]>,
  { target: `pdf` | `ebook`; lang: Lang }
> = {
  entity: {
    enter({ node }) {
      // always use decimal versions, works for BOTH ebook and browsers
      c.append(node.expectStringMetaData(`decimalEntity`));
    },
  },

  text: {
    enter({ node }) {
      c.append(node.value);
    },
  },

  redacted: {
    enter({ node }) {
      c.append(node.value);
    },
  },

  blockPassthrough: {
    enter({ node }) {
      c.append(node.value);
    },
  },

  inlinePassthrough: {
    enter({ node }) {
      c.append(node.value);
    },
  },

  symbol: {
    enter({ node }) {
      c.append(u.symbolOutput(node));
    },
  },

  money: {
    enter({ node }) {
      c.append(node.value);
    },
  },

  xref: {
    enter({ node, context: { target, lang } }) {
      const xrefTarget = node.expectStringMetaData(`target`);
      const isLinkableBack = !!node.getMetaData(`isLinkableBack`);
      const id = isLinkableBack ? `` : ` id="${xrefTarget}__xref_src"`;
      const cls = isLinkableBack ? `__xref __xref-linkable-back` : `__xref`;
      let href = `#${xrefTarget}`;

      if (target === `ebook`) {
        const targetChapter = node.document().idChapterLocations[xrefTarget];
        if (targetChapter === undefined) {
          throw new Error(`Missing xref chapter location for #${xrefTarget}`);
        }
        href = `chapter-${targetChapter}.xhtml${href}`;
      }

      // APPEND not PUSH is important for tight wrapping like [See <<note-A,Appendix BB.>>]
      c.append(`<a${id} class="${cls}" href="${href}">`);

      if (isLinkableBack) {
        let text = RETURN_SYMBOL_DECIMAL_ENTITY;
        if (target === `pdf` && lang === `en`) {
          text = `&larr; Back`;
        } else if (target === `pdf`) {
          text = `&larr; Backito`;
        }
        c.append(text);
      }
    },
    exit() {
      c.append(`</a>`);
    },
  },

  inline: wrap(`span`),
  unorderedList: wrap(`ul`),
  listItem: wrap(`li`),
  strong: wrap(`b`),
  emphasis: wrap(`em`),
  descriptionList: wrap(`dl`),
  descriptionListItemTerm: wrap(`dt`),
  descriptionListItemContent: wrap(`dd`),
  verseLine: wrap(`span`, [`verse-line`]),
  verseStanza: wrap((n) => (n.isInFootnote() ? `span` : `div`), [`verse-stanza`]),
};

export default PrimitivesVisitor;

const RETURN_SYMBOL_DECIMAL_ENTITY = `&#9166;`;
