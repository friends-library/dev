import type { AstNode } from '../types';
import type Parser from '../Parser';
import { NODE as n, TOKEN as t } from '../types';
import Node from '../nodes/AstNode';

export default class PoetryParser {
  public constructor(private p: Parser) {}

  public parse(parent: AstNode): AstNode[] {
    const stanzas: AstNode[] = [];
    const guard = this.p.makeWhileGuard(`PoetryParser.parse()`);
    while (guard() && !this.p.peekTokensAnyOf([[t.UNDERSCORE, `____`]], [t.EOF, t.EOD])) {
      const stanza = new Node(n.VERSE_STANZA, parent, { startToken: this.p.current });
      stanza.children = this.parseLines(stanza);
      parent.children.push(stanza);
      stanzas.push(stanza);
      stanza.endToken = this.p.lastSignificantToken();
      if (this.p.currentIs(t.DOUBLE_EOL)) {
        this.p.consume(t.DOUBLE_EOL);
      }
    }
    return stanzas;
  }

  private parseLines(stanza: AstNode): AstNode[] {
    const lines: AstNode[] = [];
    const guard = this.p.makeWhileGuard(`PoetryParser.parseLines()`);
    while (
      guard() &&
      !this.p.peekTokensAnyOf([t.DOUBLE_EOL], [[t.UNDERSCORE, `____`]], [t.EOF])
    ) {
      const line = new Node(n.VERSE_LINE, stanza, { startToken: this.p.current });
      this.parseLine(line);
      lines.push(line);
      line.endToken = this.p.lastSignificantToken();
    }
    return lines;
  }

  private parseLine(line: AstNode): void {
    line.children = this.p.parseUntil(line, t.EOX);
    if (this.p.currentIs(t.EOL)) {
      this.p.consume(t.EOL);
    }
  }
}
