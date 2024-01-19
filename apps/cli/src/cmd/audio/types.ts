import type { T } from '@friends-library/pairql/dev';

export type Audio = T.GetAudios.Output[number];

interface FileFsData {
  localFilename: string;
  localPath: string;
  cloudFilename: string;
  cloudPath: string;
}

export interface AudioFsData {
  relPath: string;
  abspath: string;
  derivedPath: string;
  cachedDataPath: string;
  basename: string;
  hash: string;
  hashedBasename: string;
  m4bs: {
    hq: FileFsData;
    lq: FileFsData;
  };
  mp3Zips: {
    hq: FileFsData;
    lq: FileFsData;
  };
  parts: Array<{
    hashedBasename: string;
    basename: string;
    srcCloudPath: string;
    srcLocalPath: string;
    srcLocalFileExists: boolean;
    srcHash: string;
    cachedDataPath: string;
    mp3s: {
      hq: FileFsData;
      lq: FileFsData;
    };
  }>;
}
