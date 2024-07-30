import type { FileManifest } from '@friends-library/doc-artifacts';
import type { DocPrecursor } from '@friends-library/types';
import type { EbookSrcResult } from '@friends-library/evaluator';
import { frontmatter as commonFrontmatter } from '../frontmatter';

export default function frontmatter(
  dpc: DocPrecursor,
  src: EbookSrcResult,
): FileManifest {
  const fm = commonFrontmatter(dpc, src);
  fm[`half-title`] = `<div class="half-title-page">${fm[`half-title`]}</div>`;

  if (src.hasFootnotes) {
    fm[`footnote-helper`] = src.footnoteHelperSourceHtml;
  }

  return fm;
}
