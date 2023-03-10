import stripIndent from 'strip-indent';
import type { Token, AstNode, DocumentNode as DocumentNodeInterface } from '../types';
import { NODE as n } from '../types';
import Lexer from '../Lexer';
import Node from '../nodes/AstNode';
import DocumentNode from '../nodes/DocumentNode';
import Parser from '../Parser';

export function parseAdocFile(...adoc: string[]): DocumentNodeInterface {
  const parser = getParser(...prepareAdocFile(...adoc));
  return parser.parse();
}

export function prepareAdocFile(...adocs: string[]): string[] {
  return adocs.map((adoc) => stripIndent(adoc).trim() + `\n`);
}

export function getParser(...adocs: string[]): Parser {
  const lexer = new Lexer(...adocs.map((adoc) => ({ adoc })));
  return new Parser(lexer);
}

export function getPara(): AstNode {
  return new Node(n.PARAGRAPH, getChapter());
}

export function getChapter(): AstNode {
  return new Node(n.CHAPTER, getDoc());
}

export function getDoc(): DocumentNode {
  return new DocumentNode();
}

export function getBlock(): AstNode {
  return new Node(n.BLOCK, getChapter());
}

export function assertAllNodesHaveTokens(node: AstNode): void {
  try {
    if (node.startToken && node.endToken) {
      // ¯\_(ツ)_/¯
    }
  } catch (e) {
    node.print();
    throw new Error(`Node missing tokens in assertAllNodesHaveTokens()`);
  }
  node.children.forEach((child) => assertAllNodesHaveTokens(child));
}

export function simplifyToken(token: Token): Pick<Token, 'type' | 'literal'> {
  return {
    type: token.type,
    literal: token.literal,
  };
}

export const T = {
  text: (value: string): Record<string, unknown> => {
    return { type: n.TEXT, value };
  },
  paragraph: (value: string, classList?: string[]): Record<string, unknown> => {
    return {
      type: n.PARAGRAPH,
      children: [T.text(value)],
      ...(classList ? T.context(classList) : {}),
    };
  },
  context: (classList: string[] = []): { context: { classList: string[] } } => {
    return { context: { classList } };
  },
  chapterHeading: (text: string): Record<string, unknown> => {
    return {
      type: n.HEADING,
      children: [{ type: n.HEADING_TITLE, children: [{ type: n.TEXT, value: text }] }],
      meta: { level: 2 },
    };
  },
};
