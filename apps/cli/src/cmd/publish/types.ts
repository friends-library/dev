import type { FsDocPrecursor } from '@friends-library/dpc-fs';
import type { T } from '../../api-client';

export type Edition = T.GetEdition.Output;
export type CloudFiles = T.GetEditionImpression.Output[`cloudFiles`];

export interface PendingUploads {
  paperback: {
    cover: string[];
    interior: string[];
  };
  ebook: {
    pdf: string;
    epub: string;
    speech: string;
    app: string;
    appCss?: string;
  };
  images: {
    square: Array<{ localPath: string; cloudPath: string }>;
    threeD: Array<{ localPath: string; cloudPath: string }>;
  };
}

export function emptyPendingUploads(): PendingUploads {
  return {
    paperback: { cover: [], interior: [] },
    ebook: { pdf: ``, epub: ``, speech: ``, app: `` },
    images: { square: [], threeD: [] },
  };
}

export interface PublishData {
  edition: Edition;
  dpc: FsDocPrecursor;
  uploads: PendingUploads;
  artifactOptions: { namespace: string; srcPath: string };
  impression: {
    current: T.UpsertEditionImpression.Input;
    previous: T.UpsertEditionImpression.Input | null;
  };
}
