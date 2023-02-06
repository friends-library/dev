import { DocPrecursor } from '@friends-library/types';
import { Parser, traverse } from '@friends-library/parser';
import documentVisitor from './DocumentVisitor';
import PdfSrcResult from './result/PdfSrcResult';
import EbookSrcResult from './result/EbookSrcResult';

type PartialDpc = Pick<DocPrecursor, 'asciidocFiles' | 'lang'>;

export function toEbookSrcHtml(dpc: PartialDpc): EbookSrcResult {
  return toSrcHtml(dpc, `ebook`) as EbookSrcResult;
}

export function toPdfSrcHtml(dpc: PartialDpc): PdfSrcResult {
  return toSrcHtml(dpc, `pdf`) as PdfSrcResult;
}

function toSrcHtml(
  dpc: PartialDpc,
  target: 'pdf' | 'ebook',
): PdfSrcResult | EbookSrcResult {
  const document = Parser.parseDocument(...dpc.asciidocFiles);
  const output: Array<string[]> = [];
  traverse(document, documentVisitor, output, { target, lang: dpc.lang });
  const Result = target === `pdf` ? PdfSrcResult : EbookSrcResult;
  return new Result(output, document, dpc.lang);
}
