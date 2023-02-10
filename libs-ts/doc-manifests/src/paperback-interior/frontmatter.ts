import { toRoman } from 'roman-numerals';
import {
  originalTitle as commonOriginalTitle,
  copyright as commonCopyright,
  halfTitle as commonHalfTitle,
} from '../frontmatter';
import { DocPrecursor } from '@friends-library/types';
import { PdfSrcResult, ChapterResult } from '@friends-library/evaluator';
import { rangeFromVolIdx } from '../faux-volumes';

export default function frontmatter(
  dpc: DocPrecursor,
  src: PdfSrcResult,
  volIdx?: number,
): string {
  const isFirstOrOnlyVolume = typeof volIdx !== `number` || volIdx === 0;
  return `
    ${halfTitle(dpc, volIdx)}
    ${isFirstOrOnlyVolume ? originalTitle(dpc) : ``}
    ${copyright(dpc)}
    ${isFirstOrOnlyVolume ? src.epigraphHtml : ``}
    ${toc(src, dpc, volIdx)}
  `;
}

function toc(src: PdfSrcResult, dpc: DocPrecursor, volIdx?: number): string {
  if (src.numChapters <= 3) {
    return ``;
  }
  const toEntry = useMultiColLayout(src.chapters) ? multiColTocEntry : tocEntry;
  return `
    <div class="toc own-page">
      <h1>${dpc.lang === `en` ? `Contents` : `Índice`}</h1>
      ${src.chapters
        .slice(...rangeFromVolIdx(dpc.paperbackSplits, volIdx))
        .map(toEntry)
        .join(`\n`)}
    </div>
  `;
}

export function useMultiColLayout(chapters: ChapterResult[]): boolean {
  // keep only chapters with headings like `"Chapter IV. The Lambs War"`
  // which, when they predominate, make the multi-col layout desirable
  const numberedAndNamedChapters = chapters.filter(
    (c) => !c.isIntermediateTitle && c.isSequenced && c.hasNonSequenceTitle,
  );
  const nonItermediateChapters = chapters.filter((c) => !c.isIntermediateTitle);
  return numberedAndNamedChapters.length / nonItermediateChapters.length > 0.45;
}

function multiColTocEntry(chapter: ChapterResult): string {
  if (chapter.isIntermediateTitle) {
    return tocEntry(chapter);
  }

  // if we have a sequence (chapter) number, and a non-sequence title
  // we split the chapter number left, and non-sequence title right
  // otherwise, everything goes on right
  const splittable =
    typeof chapter.sequenceNumber === `number` && chapter.hasNonSequenceTitle;

  let main = chapter.shortHeading;
  if (chapter.nonSequenceTitle && chapter.nonSequenceTitle.length < main.length) {
    main = chapter.nonSequenceTitle;
  }

  return `
    <p class="multicol-toc-entry">
      <a href="#${chapter.id}">
        <span class="multicol-toc-chapter">
          ${splittable ? toRoman(chapter.sequenceNumber ?? 1) : ``}
        </span>
        <span class="multicol-toc-main">
          ${main}
        </span>
      </a>
    </p>
    `.trim();
}

function tocEntry(chapter: ChapterResult): string {
  return `
    <p${chapter.isIntermediateTitle ? ` class="toc-intermediate-title"` : ``}>
      <a href="#${chapter.id}">
        <span>${chapter.shortHeading}</span>
      </a>
    </p>`;
}

function copyright(dpc: DocPrecursor): string {
  return commonCopyright(dpc)
    .replace(`copyright-page`, `copyright-page own-page`)
    .replace(`Ebook created`, `Created`)
    .replace(/([^@])friendslibrary\.com/g, `$1www.friendslibrary.com`);
}

function halfTitle(dpc: DocPrecursor, volIdx?: number): string {
  return `
    <div class="half-title-page own-page">
      <div>
        ${commonHalfTitle(dpc, volIdx)}
      </div>
    </div>
  `;
}

function originalTitle(dpc: DocPrecursor): string {
  if (!dpc.meta.originalTitle) {
    return ``;
  }

  return `
    <div class="blank-page own-page"></div>
    ${commonOriginalTitle(dpc)}
  `;
}
