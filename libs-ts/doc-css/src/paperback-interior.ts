import mapValues from 'lodash.mapvalues';
import { getPrintSizeDetails } from '@friends-library/lulu';
import type { PrintSize } from '@friends-library/types';
import type { PrintSizeDetails } from '@friends-library/lulu';
import * as css from './css';
import { replaceVars } from './helpers';

export default function paperbackInteriorCss(config: {
  runningHeadTitle: string;
  printSize: PrintSize;
  numFootnotes: number;
  customCss?: string;
  condense?: boolean;
}): string {
  const joined = [
    css.common,
    css.signedSections,
    css.tables,
    css.pdfBase,
    css.pdfPaging,
    css.pdfTypography,
    css.pdfHalfTitle,
    css.pdfOriginalTitle,
    css.pdfCopyright,
    css.pdfToc,
    css.pdfChapterHeading,
    css.pdfPaperbackInterior,
    css.pdfIntermediateTitle,

    ...(config.numFootnotes < 5 ? [css.pdfSymbolNotes] : []),
    ...(config.condense ? [css.pdfCondense] : []),
    ...(config.customCss ? [config.customCss] : []),
  ].join(`\n\n`);

  return replaceVars(joined, getVars(config.runningHeadTitle, config.printSize));
}

function getVars(runningHead: string, printSize: PrintSize): Record<string, string> {
  const size = getPrintSizeDetails(printSize);
  const { dims, margins } = size;

  return {
    '--running-head-title': `"${runningHead}"`,
    '--chapter-margin-top': `${dims.height / 4}in`,
    '--copyright-page-height': `${dims.height - margins.top - margins.bottom}in`,
    '--half-title-page-height': `${dims.height - (margins.top + margins.bottom) * 3}in`,
    ...printDimsVars(size),
    ...condenseVars(dims.height),
  };
}

function condenseVars(pageHeight: number): Record<string, string> {
  const topMargin = 0.7;
  const btmMargin = 0.55;
  return {
    '--condensed-copyright-page-height': `${pageHeight - topMargin - btmMargin}in`,
    '--condensed-half-title-page-height': `${pageHeight - (topMargin + btmMargin) * 3}in`,
    '--condensed-page-top-margin': `${topMargin}in`,
    '--condensed-page-bottom-margin': `${btmMargin}in`,
  };
}

export function printDimsVars(size: PrintSizeDetails): Record<string, string> {
  return mapValues(
    {
      '--page-width': size.dims.width,
      '--page-height': size.dims.height,
      '--page-top-margin': size.margins.top,
      '--page-bottom-margin': size.margins.bottom,
      '--page-outer-margin': size.margins.outer,
      '--page-inner-margin': size.margins.inner,
      '--running-head-margin-top': size.margins.runningHeadTop,
    },
    (v) => `${v}in`,
  );
}
