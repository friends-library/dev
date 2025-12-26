import path from 'path';
import fs from 'fs-extra';
import env from '@friends-library/env';
import * as cloud from '@friends-library/cloud';
import type { AudioFsData, Audio } from './types';
import { logError } from '../../sub-log';
import { md5String } from './utils';

export default async function getSrcFsData(audio: Audio): Promise<AudioFsData> {
  const { AUDIOS_PATH } = env.require(`AUDIOS_PATH`);
  const basename = audio.document.filename;
  const errors: string[] = [];
  const cachedDataDir = `${AUDIOS_PATH}/${audio.edition.path}/_cached_audio_data`;
  const data: Omit<AudioFsData, `m4bs` | `mp3Zips`> = {
    relPath: audio.edition.path,
    abspath: `${AUDIOS_PATH}/${audio.edition.path}`,
    derivedPath: `${derivedDir()}/${audio.edition.path}`,
    cachedDataPath: ``,
    hash: ``,
    hashedBasename: ``,
    basename,
    parts: [],
  };

  fs.ensureDirSync(cachedDataDir);
  fs.ensureDirSync(data.derivedPath);

  for (let idx = 0; idx < audio.parts.length; idx++) {
    let partBasename = basename;
    if (audio.parts.length > 1) {
      partBasename += `--pt${idx + 1}`;
    }
    const srcLocalPath = `${data.abspath}/${partBasename}.wav`;
    const srcCloudPath = `${data.relPath}/${partBasename}.wav`;
    const srcHash = await cloud.md5File(srcCloudPath);
    if (!srcHash) {
      errors.push(`source wav not found in cloud: ${srcCloudPath}`);
    } else {
      const part = `pt--` + String(idx + 1).padStart(2, `0`);
      const hashedBasename = `${srcHash}--${partBasename}`;
      data.parts.push({
        basename: partBasename,
        hashedBasename,
        cachedDataPath: `${cachedDataDir}/${part}--${srcHash}.json`,
        srcLocalPath,
        srcCloudPath,
        srcLocalFileExists: fs.existsSync(srcLocalPath),
        srcHash,
        mp3s: {
          hq: {
            localFilename: `${hashedBasename}.mp3`,
            localPath: `${data.derivedPath}/${hashedBasename}.mp3`,
            cloudFilename: `${partBasename}.mp3`,
            cloudPath: `${data.relPath}/${partBasename}.mp3`,
          },
          lq: {
            localFilename: `${hashedBasename}--lq.mp3`,
            localPath: `${data.derivedPath}/${hashedBasename}--lq.mp3`,
            cloudFilename: `${partBasename}--lq.mp3`,
            cloudPath: `${data.relPath}/${partBasename}--lq.mp3`,
          },
        },
      });
    }
  }

  if (errors.length) {
    errors.forEach(logError);
    console.log(``);
    process.exit(1);
  }

  data.hash = md5String(data.parts.map((p) => p.srcHash).join(``));
  data.hashedBasename = `${data.hash}--${data.basename}`;
  data.cachedDataPath = `${cachedDataDir}/combined--${data.hash}.json`;

  return {
    ...data,
    m4bs: {
      hq: {
        localFilename: `${data.hashedBasename}.m4b`,
        localPath: `${data.derivedPath}/${data.hashedBasename}.m4b`,
        cloudFilename: `${data.basename}.m4b`,
        cloudPath: `${data.relPath}/${data.basename}.m4b`,
      },
      lq: {
        localFilename: `${data.hashedBasename}--lq.m4b`,
        localPath: `${data.derivedPath}/${data.hashedBasename}--lq.m4b`,
        cloudFilename: `${data.basename}--lq.m4b`,
        cloudPath: `${data.relPath}/${data.basename}--lq.m4b`,
      },
    },
    mp3Zips: {
      hq: {
        localFilename: `${data.hashedBasename}--mp3s.zip`,
        localPath: `${data.derivedPath}/${data.hashedBasename}--mp3s.zip`,
        cloudFilename: `${data.basename}--mp3s.zip`,
        cloudPath: `${data.relPath}/${data.basename}--mp3s.zip`,
      },
      lq: {
        localFilename: `${data.hashedBasename}--mp3s--lq.zip`,
        localPath: `${data.derivedPath}/${data.hashedBasename}--mp3s--lq.zip`,
        cloudFilename: `${data.basename}--mp3s--lq.zip`,
        cloudPath: `${data.relPath}/${data.basename}--mp3s--lq.zip`,
      },
    },
  };
}

export function derivedDir(): string {
  return path.resolve(`${__dirname}/../../../src/cmd/audio/derived`);
}
