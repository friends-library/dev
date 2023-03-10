import type { AstNode } from '../types';
import type Parser from '../Parser';
import type DocumentNode from '../nodes/DocumentNode';
import { TOKEN as t, NODE as n } from '../types';
import Node from '../nodes/AstNode';
import SectionParser from './SectionParser';

export default class ChapterParser {
  public constructor(private p: Parser) {}

  public parse(parent: DocumentNode): AstNode {
    const context = this.p.parseContext();
    const chapter = new Node(n.CHAPTER, parent, { context, startToken: this.p.current });

    if (!this.p.peekTokens([t.EQUALS, `==`], t.WHITESPACE)) {
      this.p.throwError(`unexpected missing chapter heading`);
    }

    const heading = this.p.parseHeading(chapter);
    chapter.children = [heading, ...new SectionParser(this.p, 2).parseBody(chapter)];
    chapter.endToken = this.p.lastSignificantToken();

    if (this.p.peekTokens(t.EOL, t.EOF)) {
      // no more blocks in chapter, consume trailing newline
      this.p.consume(t.EOL);
    }

    return chapter;
  }
}
