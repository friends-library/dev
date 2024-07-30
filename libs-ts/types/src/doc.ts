import type { Lang, EditionType, PrintSize } from '.';

export interface DocPrecursor {
  lang: Lang;
  friendSlug: string;
  friendInitials: string[];
  documentSlug: string;
  path: string;
  editionId: string;
  isCompilation: boolean;
  editionType: EditionType;
  asciidocFiles: Array<{ adoc: string; filename: string }>;
  paperbackSplits: number[];
  printSize?: PrintSize;
  blurb: string;
  config: { [key: string]: any };
  customCode: {
    css: { [k in ArtifactType | 'all' | 'pdf' | 'ebook']?: string };
    html: { [k in ArtifactType | 'all' | 'pdf' | 'ebook']?: string };
  };
  meta: {
    title: string;
    originalTitle?: string;
    published?: number;
    isbn: string;
    editor?: string;
    author: {
      name: string;
      nameSort: string;
    };
  };
  revision: {
    timestamp: number;
    sha: string;
    url: string;
  };
}

export function genericDpc(): DocPrecursor {
  return {
    lang: `en`,
    friendSlug: `george-fox`,
    friendInitials: [`G`, `F`],
    documentSlug: `journal`,
    path: `en/george-fox/journal/original`,
    editionId: `9414033c-4b70-4b4b-8e48-fec037822173`,
    isCompilation: false,
    editionType: `original`,
    asciidocFiles: [{ adoc: ``, filename: `01-journal.adoc` }],
    paperbackSplits: [],
    blurb: ``,
    config: {},
    customCode: { css: {}, html: {} },
    meta: {
      title: `Journal of George Fox`,
      isbn: `978-1-64476-029-1`,
      author: { name: `George Fox`, nameSort: `Fox, George` },
    },
    revision: { timestamp: 1611345625, sha: `327ceb2`, url: `` },
  };
}

export const ARTIFACT_TYPES = [
  `paperback-interior`,
  `paperback-cover`,
  `web-pdf`,
  `epub`,
  `speech`,
  `app-ebook`,
] as const;

export type ArtifactType = (typeof ARTIFACT_TYPES)[number];
