import { utf8ShortTitle } from '@friends-library/adoc-utils';
import type { DocPrecursor } from '@friends-library/types';

export function runningHead(
  dpc: Pick<DocPrecursor, `meta` | `config`>,
  numChapters: number,
): string {
  const { meta, config } = dpc;
  const title = numChapters === 1 ? meta.author.name : config.shortTitle || meta.title;
  return utf8ShortTitle(title);
}

export function lineSvgMarkup(): string {
  return `<svg height="1px" width="88px" version="1.1" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="88" y2="0" style="stroke:rgb(0,0,0);stroke-width:1" /></svg>`;
}
