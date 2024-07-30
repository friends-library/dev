import * as css from './css';

export default function appEbookCss(): string {
  return [
    css.common,
    css.signedSections,
    css.tables,
    css.pdfBase,
    css.pdfTypography,
    css.pdfChapterHeading,
    css.pdfPaperbackInterior,
    css.pdfIntermediateTitle,
    css.appEbook,
  ].join(`\n\n`);
}
