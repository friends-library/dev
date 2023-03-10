import type { AstNode, TokenSpec } from '../types';
import type Parser from '../Parser';
import { NODE as n, TOKEN as t } from '../types';
import Node from '../nodes/AstNode';

export default class FootnotePoetryParser {
  public constructor(private p: Parser) {}

  public parse(parent: AstNode): AstNode {
    const block = new Node(n.BLOCK, parent, {
      startToken: this.p.current,
      subType: `verse`,
    });
    const stanzas: AstNode[] = [];
    const guard = this.p.makeWhileGuard(`FootnotePoetry.parse()`);
    while (guard() && !this.p.peekTokensAnyOf(END_FN_POETRY, [t.EOL, t.EOF])) {
      if (this.p.peekTokens(t.BACKTICK, [t.WHITESPACE, `    `])) {
        this.p.consume();
        this.p.consume();
      }
      const stanza = new Node(n.VERSE_STANZA, block, { startToken: this.p.current });
      stanza.children = this.parseLines(stanza);
      block.children.push(stanza);
      stanzas.push(stanza);
      stanza.endToken = this.p.lastSignificantToken();
      if (this.p.currentIs(t.FOOTNOTE_STANZA)) {
        this.p.consumeMany(t.FOOTNOTE_STANZA, t.EOL);
      }
    }
    block.children = stanzas;
    block.endToken = this.p.lastSignificantToken();
    this.p.consumeMany(...END_FN_POETRY);
    this.p.consume(t.EOL);
    return block;
  }

  private parseLines(stanza: AstNode): AstNode[] {
    const lines: AstNode[] = [];
    const guard = this.p.makeWhileGuard(`FootnotePoetry.parseLines()`);
    while (guard() && !this.p.peekTokensAnyOf([t.FOOTNOTE_STANZA], END_FN_POETRY)) {
      this.p.consumeIf([t.WHITESPACE, `     `]);
      const line = new Node(n.VERSE_LINE, stanza, { startToken: this.p.current });
      line.children = this.parseLine(line);
      lines.push(line);
      line.endToken = this.p.lastSignificantToken();
      this.p.consumeIf([t.WHITESPACE, `     `]);
    }
    return lines;
  }

  private parseLine(line: AstNode): AstNode[] {
    const children = this.p.parseUntilAnyOf(line, [t.EOL], END_FN_POETRY, [
      t.FOOTNOTE_STANZA,
    ]);

    if (this.p.currentIs(t.EOL)) {
      this.p.consume(t.EOL);
    }
    return children;
  }
}

const END_FN_POETRY: TokenSpec[] = [[t.WHITESPACE, ` `], t.BACKTICK];
