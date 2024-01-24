import { dirname } from 'path';
import fs from 'fs-extra';
import { sync as glob } from 'glob';
import exec from 'x-exec';
import isEqual from 'lodash.isequal';
import md5File from 'md5-file';
import { c as cl, log } from 'x-chalk';
import { AUDIO_QUALITIES } from '@friends-library/types';
import * as cloud from '@friends-library/cloud';
import type { AudioQuality, Lang } from '@friends-library/types';
import type { Audio } from './types';
import type { AudioFsData } from './types';
import { logDebug, logAction, logError } from '../../sub-log';
import * as ffmpeg from '../../ffmpeg';
import api, { type T } from '../../api-client';
import * as cache from './cache';
import * as m4bTool from './m4b';
import getSrcFsData from './audio-fs-data';
import queryFilteredAudios from './query-filtered-audios';

interface Argv {
  lang: Lang | 'both';
  limit: number;
  dryRun: boolean;
  skipLargeUploads: boolean;
  cleanDerivedDir: boolean;
  pattern?: string;
}

let argv: Argv = {
  lang: `both`,
  limit: 999999,
  dryRun: false,
  skipLargeUploads: false,
  cleanDerivedDir: false,
};

export default async function handler(passedArgv: Argv): Promise<void> {
  argv = passedArgv;
  ffmpeg.ensureExists();
  m4bTool.ensureExists();
  const audios = await queryFilteredAudios(argv.lang, argv.pattern, argv.limit);
  if (audios.length === 0) {
    logError(`No audios matched`);
    return;
  }

  for (const audio of audios) {
    await handleAudio(audio);
  }
  log(``);
}

async function handleAudio(audio: Audio): Promise<void> {
  const { edition } = audio;
  log(cl`\nHandling audio: {magenta ${edition.path}}`);
  const fsData = await getSrcFsData(audio);

  await ensureAudioImage(audio, fsData);
  await deriveUncachedMp3s(audio, fsData);
  await syncMp3s(audio, fsData);
  await syncMp3Zips(audio, fsData);
  await syncM4bs(audio, fsData);
  await updateEntities(audio, fsData);

  await cleanCacheFiles(fsData);

  if (argv.cleanDerivedDir && fsData.derivedPath) {
    exec.exit(`rm -rf ${fsData.derivedPath}`);
  }
}

async function ensureAudioImage(audio: Audio, fsData: AudioFsData): Promise<void> {
  const cloudPath = audio.edition.coverImagePath;
  const localPath = `${fsData.derivedPath}/cover.png`;
  if (fs.existsSync(localPath)) {
    const localHash = await md5File(localPath);
    const remoteHash = await cloud.md5File(cloudPath);
    if (localHash === remoteHash) {
      logDebug(`audio cover image already in place in derived dir`);
      return;
    }
  }
  logAction(`downloading audio cover image`);
  if (argv.dryRun) return;
  const buffer = await cloud.downloadFile(cloudPath);
  fs.writeFileSync(localPath, buffer);
}

async function deriveUncachedMp3s(audio: Audio, fsData: AudioFsData): Promise<void> {
  for (let idx = 0; idx < audio.parts.length; idx++) {
    const cached = cache.getPart(fsData, idx);
    for (const quality of AUDIO_QUALITIES) {
      const mp3Path = fsData.parts[idx]!.mp3s[quality].localPath;
      const partDesc = `pt${idx + 1} (${quality})`;
      if (fs.existsSync(mp3Path) && !cached[quality]) {
        logAction(`storing cache data mp3 for ${cl`{cyan ${partDesc}}`}`);
        !argv.dryRun && (await cache.setPartQuality(fsData, idx, quality));
      } else if (!cached[quality]) {
        !argv.dryRun && (await ensureLocalMp3(audio, fsData, idx, quality));
        !argv.dryRun && (await cache.setPartQuality(fsData, idx, quality));
      } else {
        logDebug(`found valid cached fs data for mp3 ${partDesc}`);
      }
    }
  }
}

async function syncMp3s(audio: Audio, fsData: AudioFsData): Promise<void> {
  for (let idx = 0; idx < audio.parts.length; idx++) {
    const cached = cache.getPart(fsData, idx);
    for (const quality of AUDIO_QUALITIES) {
      const mp3Info = fsData.parts[idx]!.mp3s[quality];
      const localHash = ensureCache(cached[quality]).mp3Hash;
      const remoteHash = await cloud.md5File(mp3Info.cloudPath);
      const partDesc = `pt${idx + 1} (${quality})`;
      if (localHash !== remoteHash) {
        logAction(`uploading changed mp3 for ${cl`{cyan ${partDesc}}`}`);
        if (!argv.dryRun) {
          await ensureLocalMp3(audio, fsData, idx, quality);
          await cloud.uploadFile(mp3Info.localPath, mp3Info.cloudPath);
        }
      } else {
        logDebug(`skipping mp3 upload for ${partDesc} - remote file identical`);
      }
    }
  }
}

async function syncMp3Zips(audio: Audio, fsData: AudioFsData): Promise<void> {
  const cached = cache.get(fsData);
  for (const quality of AUDIO_QUALITIES) {
    const localZipPath = fsData.mp3Zips[quality].localPath;
    const hasCache = !!cached[quality]?.mp3ZipHash;
    if (fs.existsSync(localZipPath) && !hasCache) {
      logAction(`storing cache data for mp3 zip ${cl`{cyan (${quality})}`}`);
      !argv.dryRun && (await cache.setMp3ZipQuality(fsData, quality));
    } else if (!hasCache) {
      !argv.dryRun && (await ensureLocalMp3Zip(audio, fsData, quality));
      !argv.dryRun && (await cache.setMp3ZipQuality(fsData, quality));
    } else {
      logDebug(`found valid cached fs data for mp3 zip (${quality})`);
    }

    // now we know we have good cached data, reload it
    const { mp3ZipHash: localZipHash } = ensureCache(cache.get(fsData)[quality]);
    if (typeof localZipHash === `undefined`) {
      throw new Error(`Unexpected missing mp3 zip hash from cache, q: ${quality}`);
    }

    const cloudFilepath = fsData.mp3Zips[quality].cloudPath;
    const cloudZipHash = await cloud.md5File(cloudFilepath);
    if (localZipHash !== cloudZipHash) {
      logAction(`uploading new mp3 zip ${cl`{cyan (${quality})}`} to cloud storage`);
      !argv.dryRun && (await ensureLocalMp3Zip(audio, fsData, quality));
      if (!argv.skipLargeUploads) {
        !argv.dryRun && (await cloud.uploadFile(localZipPath, cloudFilepath));
      } else {
        logDebug(`skipping mp3 zip (${quality}) upload due to --skip-large-uploads`);
      }
    } else {
      logDebug(`skipping upload of mp3 zip (${quality}) - remote file identical`);
    }
  }
}

async function syncM4bs(audio: Audio, fsData: AudioFsData): Promise<void> {
  const cached = cache.get(fsData);
  for (const quality of AUDIO_QUALITIES) {
    const localM4bPath = fsData.m4bs[quality].localPath;
    const hasCache = !!cached[quality]?.m4bHash;
    if (fs.existsSync(localM4bPath) && !hasCache) {
      logAction(`storing cache data for m4b ${cl`{cyan (${quality})}`}`);
      !argv.dryRun && (await cache.setM4bQuality(fsData, quality));
    } else if (!hasCache) {
      !argv.dryRun && (await ensureLocalM4b(audio, fsData, quality));
      !argv.dryRun && (await cache.setM4bQuality(fsData, quality));
    } else {
      logDebug(`found valid cached fs data for m4b (${quality})`);
    }

    // now we know we have good cached data, reload it
    const { m4bHash: localM4bHash } = ensureCache(cache.get(fsData)[quality]);
    if (typeof localM4bHash === `undefined`) {
      throw new Error(`Unexpected missing m4b hash from cache, q: ${quality}`);
    }

    const cloudFilepath = fsData.m4bs[quality].cloudPath;
    const cloudM4bHash = await cloud.md5File(cloudFilepath);
    if (localM4bHash !== cloudM4bHash) {
      logAction(`uploading new m4b ${cl`{cyan (${quality})}`} to cloud storage`);
      !argv.dryRun && (await ensureLocalM4b(audio, fsData, quality));
      if (!argv.skipLargeUploads) {
        !argv.dryRun && (await cloud.uploadFile(localM4bPath, cloudFilepath));
      } else {
        logDebug(`skipping m4b (${quality}) upload due to --skip-large-uploads`);
      }
    } else {
      logDebug(`skipping upload of m4b (${quality}) - remote file identical`);
    }
  }
}

async function updateEntities(audio: Audio, fsData: AudioFsData): Promise<void> {
  const cached = cache.get(fsData);
  const hqCache = ensureCache(cached.hq);
  const lqCache = ensureCache(cached.lq);

  const existingAudio: T.UpdateAudio.Input = {
    id: audio.id,
    editionId: audio.edition.id,
    isIncomplete: audio.isIncomplete,
    m4bSizeHq: audio.m4bSizeHq,
    m4bSizeLq: audio.m4bSizeLq,
    mp3ZipSizeHq: audio.mp3ZipSizeHq,
    mp3ZipSizeLq: audio.mp3ZipSizeLq,
    reader: audio.reader,
  };

  const updatedAudio: T.UpdateAudio.Input = {
    ...existingAudio,
    m4bSizeHq: assertDefined(hqCache.m4bSize),
    m4bSizeLq: assertDefined(lqCache.m4bSize),
    mp3ZipSizeHq: assertDefined(hqCache.mp3ZipSize),
    mp3ZipSizeLq: assertDefined(lqCache.mp3ZipSize),
  };

  if (!isEqual(existingAudio, updatedAudio)) {
    logAction(`updating audio entity`);
    !argv.dryRun && (await api.updateAudio(updatedAudio));
  } else {
    logDebug(`skipping update audio entity, unchanged`);
  }

  for (let index = 0; index < audio.parts.length; index++) {
    const part = assertDefined(audio.parts[index]);
    const existingPart: T.UpdateAudioPart.Input = {
      id: part.id,
      audioId: audio.id,
      title: part.title,
      order: part.order,
      chapters: part.chapters,
      duration: part.durationInSeconds,
      mp3SizeHq: part.mp3SizeHq,
      mp3SizeLq: part.mp3SizeLq,
    };

    await ensureLocalWav(audio, fsData, index); // to calculate duration

    const updatedPart: T.UpdateAudioPart.Input = {
      ...existingPart,
      mp3SizeHq: assertDefined(cache.getPart(fsData, index).hq?.mp3Size),
      mp3SizeLq: assertDefined(cache.getPart(fsData, index).lq?.mp3Size),
      duration: ffmpeg.getDuration(assertDefined(fsData.parts[index]?.srcLocalPath))[1],
    };

    if (!isEqual(existingPart, updatedPart)) {
      logAction(`updating part entity ${cl`{cyan pt${index + 1}}`}`);
      !argv.dryRun && (await api.updateAudioPart(updatedPart));
    } else {
      logDebug(`skipping update of unchanged audio part entity pt${index + 1}`);
    }
  }
}

async function ensureLocalM4b(
  audio: Audio,
  fsData: AudioFsData,
  quality: AudioQuality,
): Promise<void> {
  const localPath = fsData.m4bs[quality].localPath;
  if (fs.existsSync(localPath)) {
    return;
  }
  logAction(`creating m4b ${cl`{cyan (${quality})}`}`);
  !argv.dryRun && (await m4bTool.create(audio, fsData, quality));
}

async function ensureLocalMp3Zip(
  audio: Audio,
  fsData: AudioFsData,
  quality: AudioQuality,
): Promise<void> {
  const localPath = fsData.mp3Zips[quality].localPath;
  if (fs.existsSync(localPath)) {
    return;
  }
  await createMp3Zip(audio, fsData, quality);
}

async function createMp3Zip(
  audio: Audio,
  fsData: AudioFsData,
  quality: AudioQuality,
): Promise<void> {
  logAction(`creating mp3 zip ${cl`{cyan (${quality})}`}`);
  const zipFilename = fsData.mp3Zips[quality].localFilename;
  const mp3Filenames: string[] = [];
  const unhashed: string[] = [];

  for (let idx = 0; idx < audio.parts.length; idx++) {
    await ensureLocalMp3(audio, fsData, idx, quality);
    const mp3Data = fsData.parts[idx]!.mp3s[quality];
    const hashedPath = mp3Data.localPath;
    const unhashedPath = hashedPath.replace(mp3Data.localFilename, mp3Data.cloudFilename);
    unhashed.push(unhashedPath);
    exec.exit(`cp ${hashedPath} ${unhashedPath}`);
    mp3Filenames.push(mp3Data.cloudFilename);
  }

  exec.exit(`zip ${zipFilename} ${mp3Filenames.join(` `)}`, fsData.derivedPath);
  unhashed.forEach((unhashedPath) => fs.unlinkSync(unhashedPath));
}

async function createMp3(
  audio: Audio,
  fsData: AudioFsData,
  partIndex: number,
  quality: AudioQuality,
  destPath: string,
): Promise<void> {
  const part = assertDefined(fsData.parts[partIndex]);
  await ensureLocalWav(audio, fsData, partIndex);
  ffmpeg.createMp3(audio, partIndex, part.srcLocalPath, destPath, quality);
}

async function ensureLocalWav(
  audio: Audio,
  fsData: AudioFsData,
  partIndex: number,
): Promise<void> {
  const part = assertDefined(fsData.parts[partIndex]);
  if (!part.srcLocalFileExists) {
    const partDesc = `pt${partIndex + 1}`;
    logAction(`downloading missing source .wav file for ${cl`{cyan ${partDesc}}`}`);
    const buff = await cloud.downloadFile(part.srcCloudPath);
    fs.ensureDirSync(dirname(part.srcLocalPath));
    fs.writeFileSync(part.srcLocalPath, buff);
    part.srcLocalFileExists = true;
  }
}

async function ensureLocalMp3(
  audio: Audio,
  fsData: AudioFsData,
  partIndex: number,
  quality: AudioQuality,
): Promise<void> {
  const mp3Path = fsData.parts[partIndex]!.mp3s[quality].localPath;
  if (fs.existsSync(mp3Path)) {
    return;
  }

  // much faster to download an MP3 than re-create, so try that first
  const partDesc = `pt${partIndex + 1} (${quality})`;
  const cached = cache.getPart(fsData, partIndex);
  const hasCache = !!cached[quality]?.mp3Hash;
  if (hasCache) {
    const mp3Info = fsData.parts[partIndex]!.mp3s[quality];
    const localHash = ensureCache(cached[quality]).mp3Hash;
    const remoteHash = await cloud.md5File(mp3Info.cloudPath);
    if (localHash === remoteHash) {
      logAction(`downloading missing mp3 for ${cl`{cyan ${partDesc}}`}`);
      const buff = await cloud.downloadFile(mp3Info.cloudPath);
      fs.writeFileSync(mp3Path, buff);
      return;
    }
  }

  logAction(`creating missing mp3 for ${cl`{cyan ${partDesc}}`}`);
  !argv.dryRun && (await createMp3(audio, fsData, partIndex, quality, mp3Path));
}

async function cleanCacheFiles(fsData: AudioFsData): Promise<void> {
  const keepList = [fsData.cachedDataPath, ...fsData.parts.map((p) => p.cachedDataPath)];
  const cacheFiles = glob(`${dirname(fsData.cachedDataPath)}/**/*.json`);
  cacheFiles.filter((f) => !keepList.includes(f)).forEach((f) => fs.unlinkSync(f));
}

function ensureCache<T>(cached: T): NonNullable<T> {
  assertCache(cached);
  return cached;
}

function assertCache<T>(cached: T): asserts cached is NonNullable<T> {
  if (cached === undefined) {
    logError(`Unexpected missing cache\n\n`);
    console.trace(`Unexpected Missing Cache`);
    process.exit(1);
  }
}

function assertDefined<T>(x: T | undefined): T {
  if (x === undefined) {
    console.trace();
    console.error(`Unexpected undefined value in assertDefined()`);
    process.exit(1);
  }
  return x;
}
