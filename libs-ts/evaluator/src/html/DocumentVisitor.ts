import type { Visitor } from '@friends-library/parser';
import type { Lang } from '@friends-library/types';
import { utils as u, chapterMarkup as c, wrap } from '../utils';
import AttributedQuoteBlockVisitor from './AttributedQuoteBlockVisitor';
import HeadingVisitor from './HeadingVisitor';
import ParagraphVisitor from './ParagraphVisitor';
import FootnoteVisitor from './FootnoteVisitor';
import PrimitivesVisitor from './PrimitivesVisitor';

type Output = Array<string[]>;
type Context = { target: `pdf` | `ebook`; lang: Lang };

const documentVisitor: Visitor<Output, Context> = {
  chapter: {
    enter({ node, output, index }) {
      c.reset();
      output.push(c.get());
      const { context } = node;
      const hasSignedSection = node.getMetaData(`hasSignedSection`) === true;
      const classes = [
        `chapter`,
        `chapter-${index + 1}`,
        `chapter--${hasSignedSection ? `has` : `no`}-signed-section`,
        ...u.consumeClasses(node),
      ];
      const id = context?.id ? context.id : `chapter-${index + 1}`;
      node.setMetaData(`id`, id);
      c.push(`<div id="${id}" class="${classes.join(` `)}">`);
    },
    exit() {
      c.push(`</div>`);
    },
  },

  block: {
    dispatch({ node }) {
      if (node.isAttributedQuoteBlock()) {
        return new AttributedQuoteBlockVisitor();
      } else if (node.isPoetryBlock()) {
        return wrap(`section`, [`poetry`]);
      } else if (node.isQuoteBlock()) {
        return wrap(`blockquote`);
      } else if (node.isExampleBlock() || node.isOpenBlock()) {
        return wrap(`div`);
      } else {
        return {};
      }
    },
  },

  thematicBreak: {
    enter({ node }) {
      if (node.hasClass(`asterism`)) {
        c.push(`<div class="asterism">*&#160;&#160;*&#160;&#160;*</div>`);
      } else if (node.hasClass(`small-break`)) {
        c.push(`<div class="small-break"></div>`);
      }
    },
  },

  postscriptIdentifier: {
    enter({ node }) {
      c.append(`<em>${node.value}</em>`);
    },
  },

  discoursePartIdentifier: {
    enter({ node }) {
      c.append(`<em>${node.value}</em>`);
    },
  },

  headingSegment: {
    enter({ node }) {
      c.append(`<span class="heading-segment heading-segment--${node.meta.level}">`);
    },
    exit() {
      c.append(`</span>`);
    },
  },

  paragraph: new ParagraphVisitor(),

  ...PrimitivesVisitor,
  ...HeadingVisitor,
  ...FootnoteVisitor,
};

export default documentVisitor;
