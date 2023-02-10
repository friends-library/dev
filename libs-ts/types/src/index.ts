export * from './doc';

export type Environment = `production` | `staging` | `development`;

export const LANGS = [`en`, `es`] as const;
export type Lang = (typeof LANGS)[number];

export const EDITION_TYPES = [`original`, `modernized`, `updated`] as const;
export type EditionType = (typeof EDITION_TYPES)[number];

export const PRINT_SIZES = [`s`, `m`, `xl`] as const;
export type PrintSize = (typeof PRINT_SIZES)[number];

export const PRINT_SIZE_VARIANTS = [`s`, `m`, `xl`, `xl--condensed`] as const;
export type PrintSizeVariant = (typeof PRINT_SIZE_VARIANTS)[number];

export const AUDIO_QUALITIES = [`HQ`, `LQ`] as const;
export type AudioQuality = (typeof AUDIO_QUALITIES)[number];

export interface CoverProps {
  lang: Lang;
  title: string;
  isCompilation: boolean;
  author: string;
  size: PrintSize;
  pages: number;
  edition: EditionType;
  isbn: string;
  blurb: string;
  customCss: string;
  customHtml: string;
  fauxVolumeNum?: number;
  showGuides?: boolean;
  scope?: string;
  scaler?: number;
}

export function isPrintSize(x: unknown): x is PrintSize {
  if (typeof x !== `string`) {
    return false;
  }
  return ([...PRINT_SIZES] as string[]).includes(x);
}

export function isEdition(x: unknown): x is EditionType {
  if (typeof x !== `string`) {
    return false;
  }
  return ([...EDITION_TYPES] as string[]).includes(x);
}

export const HTML_DEC_ENTITIES = {
  LEFT_DOUBLE_QUOTE: `&#8220;`,
  RIGHT_DOUBLE_QUOTE: `&#8221;`,
  LEFT_SINGLE_QUOTE: `&#8216;`,
  RIGHT_SINGLE_QUOTE: `&#8217;`,
  MDASH: `&#8212;`,
  AMPERSAND: `&#38;`,
  ELLIPSES: `&#8230;`,
  NON_BREAKING_SPACE: `&#160;`,
};
