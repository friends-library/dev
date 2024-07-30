import type { ArtifactType } from '@friends-library/types';
import type { PdfOptions, FileManifest, EbookOptions } from './types';
import pdf from './pdf';
import epub from './epub';
import speech from './speech';
import appEbook from './app-ebook';

export { pdf, epub, speech, appEbook };
export { deleteNamespaceDir, dirs } from './dirs';
export type { FileManifest };

export async function create(
  type: ArtifactType,
  manifest: FileManifest,
  filenameNoExt: string,
  options: PdfOptions & EbookOptions,
): Promise<string> {
  switch (type) {
    case `speech`:
      return speech(manifest, filenameNoExt, options);
    case `web-pdf`:
    case `paperback-cover`:
    case `paperback-interior`:
      return pdf(manifest, filenameNoExt, options);
    case `epub`:
      return epub(manifest, filenameNoExt, options);
    case `app-ebook`:
      return appEbook(manifest, filenameNoExt, options);
  }
}
