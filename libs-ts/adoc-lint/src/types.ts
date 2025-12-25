import type { Lang, EditionType } from '@friends-library/types';

export interface LintResult {
  line: number;
  column: number | false;
  type: `error` | `warning` | `notice`;
  rule: string;
  message: string;
  recommendation?: string;
  fixable?: boolean;
  info?: string;
}

export interface LintOptions {
  lang: Lang;
  editionType?: EditionType;
  include?: string[];
  exclude?: string[];
  maybe?: boolean;
}

export interface LineRule {
  (line: string, lines: string[], lineNumber: number, options: LintOptions): LintResult[];
  slug: string;
  maybe?: boolean;
}

export interface BlockRule {
  (block: string, options: LintOptions): LintResult[];
  slug: string;
  maybe?: boolean;
}
