import { TOKEN as t } from '@friends-library/parser';
import type { AstNode, Token, Visitable } from '@friends-library/parser';

let _chapterLines: string[] = [];

/**
 * Convenience singleton for better ergonomics
 * when building up chapter markup across multiple
 * files and functions
 */
class ChapterMarkup {
  private DEFER_STR = `<!-- DEFER OUTPUT -->`;
  private paused = false;

  public pause(): void {
    this.paused = true;
  }

  public unpause(): void {
    this.paused = false;
  }

  public defer(): void {
    this.push(this.DEFER_STR);
    this.push(``);
  }

  public fulfillDeferred(str: string): void {
    let index = _chapterLines.length - 1;
    let line = _chapterLines[index];
    while (index > 0 && line !== this.DEFER_STR) {
      line = _chapterLines[--index];
    }
    if (line !== this.DEFER_STR) {
      throw new Error(`Unable to fulfill deferred output`);
    }
    _chapterLines[index] = str;
  }

  public push(str: string): void {
    !this.paused && _chapterLines.push(str);
  }

  public append(str: string): void {
    if (this.paused) {
      return;
    }
    _chapterLines[_chapterLines.length - 1] = `${
      _chapterLines[_chapterLines.length - 1]
    }${str}`;
  }

  public reset(): void {
    _chapterLines = [];
  }

  public get(): string[] {
    return _chapterLines;
  }
}

export const chapterMarkup = new ChapterMarkup();
const c = chapterMarkup;

export function symbolOutput(node: AstNode): string {
  switch (node.meta.subType) {
    case t.LEFT_DOUBLE_CURLY:
      return `“`;
    case t.RIGHT_DOUBLE_CURLY:
      return `”`;
    case t.LEFT_SINGLE_CURLY:
      return `‘`;
    case t.RIGHT_SINGLE_CURLY:
      return `’`;
    case t.DOUBLE_DASH:
      return `—`;
    case t.POUND_SYMBOL:
    case t.DOLLAR_SYMBOL:
    case t.DEGREE_SYMBOL:
      return node.value;
    default:
      node.print(true);
      throw new Error(`unhandled symbol: ${node.value}`);
  }
}

export function joinTokens(tokens: Token[]): string {
  return tokens
    .map((token) => {
      switch (token.type) {
        case t.LEFT_DOUBLE_CURLY:
          return `“`;
        case t.RIGHT_DOUBLE_CURLY:
          return `”`;
        case t.LEFT_SINGLE_CURLY:
          return `‘`;
        case t.RIGHT_SINGLE_CURLY:
          return `’`;
        case t.DOUBLE_DASH:
          return `—`;
        default:
          return token.literal;
      }
    })
    .join(``);
}

export function wrap(
  tag: string | ((node: AstNode) => string | null),
  classList?: string[] | ((node: AstNode) => string[]),
): Visitable<unknown> {
  return {
    enter({ node }) {
      const el = typeof tag === `function` ? tag(node) : tag;
      const classes = typeof classList === `function` ? classList(node) : classList;
      el && c.append(`<${el}${classAttr(node, classes) || classAttr(node.parent)}>`);
    },
    exit({ node }) {
      const el = typeof tag === `function` ? tag(node) : tag;
      el && c.append(`</${el}>`);
    },
  };
}

export function classAttr(node: AstNode, classes?: string[]): string {
  classes = [...(classes ?? []), ...consumeClasses(node)];
  return classes.length ? ` class="${classes.join(` `)}"` : ``;
}

export function consumeClasses(node: AstNode): string[] {
  if (node.getMetaData(CONSUMED_CLASSES) !== true) {
    node.setMetaData(CONSUMED_CLASSES, true);
    return [...(node.context?.classList ?? [])];
  }
  return [];
}

export function trimTrailingPunctuation(str: string): string {
  if (str.endsWith(`etc.`)) {
    return str;
  }
  return str.replace(/[.,;:]$/, ``);
}

export const utils = {
  consumeClasses,
  classAttr,
  wrap,
  joinTokens,
  symbolOutput,
  trimTrailingPunctuation,
};

const CONSUMED_CLASSES = `__CONSUMED_CLASSES`;
