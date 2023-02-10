import mapValues from 'lodash.mapvalues';
import type { FileManifest } from '@friends-library/doc-artifacts';
import type { DocPrecursor } from '@friends-library/types';
import type { EbookConfig } from '../types';
import epub from '../epub';

export default async function mobi(
  dpc: DocPrecursor,
  conf: EbookConfig,
): Promise<FileManifest[]> {
  const ebookManifests = await epub(dpc, conf);
  return mobiFromEbook(ebookManifests);
}

export function mobiFromEbook(manifests: FileManifest[]): FileManifest[] {
  return manifests.map((manifest) => {
    return mapValues(manifest, (content) => {
      if (typeof content !== `string`) return content;
      return content.replace(
        /<meta charset="UTF-8"\/>/gm,
        `<meta http-equiv="Content-Type" content="application/xml+xhtml; charset=UTF-8"/>`,
      );
    });
  });
}
