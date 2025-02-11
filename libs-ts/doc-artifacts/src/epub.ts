import type { EbookOptions, FileManifest } from './types';
import { writeEbookManifest } from './ebook';

export default async function epub(
  manifest: FileManifest,
  filenameNoExt: string,
  opts: EbookOptions,
): Promise<string> {
  return await writeEbookManifest(manifest, filenameNoExt, opts);
}
