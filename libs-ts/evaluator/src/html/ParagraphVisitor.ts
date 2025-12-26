import { NODE as n } from '@friends-library/parser';
import type { Visitable, AstNode, VisitData } from '@friends-library/parser';
import { utils as u, chapterMarkup as c } from '../utils';

export default class ParagraphVisitor implements Visitable {
  protected subGroupIsOpen = false;

  enter({ node }: VisitData): void {
    const el = isChapterSubtitleBlurb(node) ? `h3` : `p`;
    if (opensNumberedSubgroup(node)) {
      c.push(`<div${u.classAttr(node)}>`);
      // this seems like a smell... i think it's telling me
      // that the parser should be creating a wrapping node
      // so that the evaluator doesn't have to be this smart or stateful...
      this.subGroupIsOpen = true;
    }
    c.push(`<${el}${classAttr(el, node)}>`);
  }

  exit({ node }: VisitData): void {
    const el = isChapterSubtitleBlurb(node) ? `h3` : `p`;
    c.push(`</${el}>`);
    if (this.closesNumberedSubgroup(node)) {
      c.push(`</div>`);
      this.subGroupIsOpen = false;
    }
  }

  closesNumberedSubgroup(node: AstNode): boolean {
    if (!this.subGroupIsOpen) {
      return false;
    }
    return !!(
      node.parent.hasClass(`numbered-group`) &&
      (node.isLastChild() ||
        node.nextSibling()?.hasClass(`numbered`) ||
        node.nextSibling()?.type !== n.PARAGRAPH)
    );
  }
}

function opensNumberedSubgroup(node: AstNode): boolean {
  return node.hasClass(`numbered`);
}

function isChapterSubtitleBlurb(node: AstNode): boolean {
  return (
    node.hasClass(`chapter-subtitle--blurb`) ||
    node.parent.hasClass(`chapter-subtitle--blurb`)
  );
}

function classAttr(el: `p` | `h3`, node: AstNode): string {
  let htmlAttr = u.classAttr(node) || u.classAttr(node.parent);
  if (el === `h3`) {
    return htmlAttr;
  }

  if (htmlAttr === ``) {
    htmlAttr = ` class="paragraph"`;
  } else if (htmlAttr.includes(`emphasized`)) {
    htmlAttr = htmlAttr.replace(`class="`, `class="paragraph `);
  }
  return htmlAttr;
}
