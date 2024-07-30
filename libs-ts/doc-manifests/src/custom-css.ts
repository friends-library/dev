import type { DocPrecursor, ArtifactType } from '@friends-library/types';

export function getCustomCss(
  customCss: DocPrecursor['customCode']['css'],
  type: ArtifactType,
): string | undefined {
  const cssChunks = [customCss.all ?? ``];

  if ([`paperback-interior`, `web-pdf`].includes(type) && customCss.pdf !== undefined) {
    cssChunks.push(customCss.pdf);
  }

  if (type === `epub` && customCss.ebook !== undefined) {
    cssChunks.push(customCss.ebook);
  }

  if (typeof customCss[type] === `string`) {
    cssChunks.push(customCss[type] ?? ``);
  }

  return cssChunks.length === 0 ? undefined : cssChunks.join(`\n\n`);
}
