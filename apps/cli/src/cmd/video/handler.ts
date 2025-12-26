import fs from 'fs-extra';
import exec from 'x-exec';
import { c, log } from 'x-chalk';
import * as cloud from '@friends-library/cloud';
import type { Lang } from '@friends-library/types';
import type { AudioFsData, Audio } from '../audio/types';
import * as ffmpeg from '../../ffmpeg';
import getAudioFsData from '../audio/audio-fs-data';
import { logAction, logDebug } from '../../sub-log';
import queryFilteredAudios from '../audio/query-filtered-audios';
import { slideshowConcatFileLines } from './slideshow';
import { metadata } from './metadata';
import * as posterApp from './poster-server';

interface Argv {
  lang: Lang | `both`;
  limit: number;
  dryRun: boolean;
  posterServerPort: number;
  pattern?: string;
}

export default async function handler(argv: Argv): Promise<void> {
  ffmpeg.ensureExists();
  for (const audio of await queryFilteredAudios(argv.lang, argv.pattern, argv.limit)) {
    await handleAudio(audio, argv);
  }
}

async function handleAudio(audio: Audio, argv: Argv): Promise<void> {
  const { edition } = audio;
  log(c`\nHandling audio: {magenta ${edition.path}}`);

  logDebug(`preparing audio source data`);
  const audioFsData = await getAudioFsData(audio);
  const workDir = audioFsData.derivedPath;
  exec.exit(`open ${workDir}`);
  const durations = audio.parts.map((p) => p.durationInSeconds);
  const splits = splitVolumes(durations);
  for (let idx = 0; idx < splits.length; idx++) {
    await makeVideo(
      audio,
      durations,
      splits[idx]!,
      splits[idx + 1],
      idx + 1,
      splits.length,
      workDir,
      audioFsData,
      argv.posterServerPort,
    );
  }

  logAction(`please manually upload to youtube`);
}

function splitVolumes(durations: number[]): number[] {
  const MAX_VIDEO_LENGTH = 60 * 60 * 12; // youtube rule, must be shorter than 12 hrs
  const startPoints = [0];
  let videoDuration = 0;
  durations.forEach((duration, idx) => {
    if (videoDuration + duration > MAX_VIDEO_LENGTH) {
      videoDuration = duration;
      startPoints.push(idx);
    }
    videoDuration += duration;
  });
  return startPoints;
}

async function makeVideo(
  audio: Audio,
  allDurations: number[],
  startIdx: number,
  nextVolIdx: number | undefined,
  volNum: number,
  numVols: number,
  workDir: string,
  audioFsData: AudioFsData,
  posterServerPort: number,
): Promise<void> {
  const suffix = numVols === 1 ? `` : `-v${volNum}`;
  const audioFilename = `video-src${suffix}.wav`;
  const durations = allDurations.slice(startIdx, nextVolIdx ?? Infinity);

  // pull down source .wav files
  for (let i = 0; i < audioFsData.parts.length; i++) {
    const part = audioFsData.parts[i]!;
    if (part.srcLocalFileExists) {
      continue;
    }
    logAction(`downloading source .wav file for ${c`{cyan pt. ${i + 1}}`}`);
    const buff = await cloud.downloadFile(part.srcCloudPath);
    fs.writeFileSync(part.srcLocalPath, buff);
  }

  if (audio.parts.length > 1) {
    logDebug(`joining source wav files for video creation`);
    ffmpeg.joinWavs(
      workDir,
      audioFsData.parts
        .filter((p, idx) => idx >= startIdx && (!nextVolIdx || idx < nextVolIdx))
        .map((p) => p.srcLocalPath),
      audioFilename,
    );
  } else {
    exec.exit(`cp ${audioFsData.parts[0]!.srcLocalPath} ${workDir}/${audioFilename}`);
  }

  logDebug(`capturing poster images`);
  const imgs = await capturePosterImages(
    audio,
    workDir,
    volNum,
    numVols,
    posterServerPort,
  );

  const slideLines = slideshowConcatFileLines(
    durations,
    startIdx,
    nextVolIdx === undefined,
  );

  logDebug(`creating video`);
  const slideFilepath = `${workDir}/slides.txt`;
  const document = audio.document;
  const friend = audio.friend;
  const videoFile = `${friend.slug}-${document.slug}${suffix}.mp4`;
  fs.writeFileSync(slideFilepath, slideLines.join(`\n`));
  ffmpeg.makeVideo(workDir, audioFilename, videoFile);
  fs.unlinkSync(`${workDir}/${audioFilename}`);
  fs.unlinkSync(slideFilepath);
  exec.exit(`cp ${workDir}/cover.png ${workDir}/thumbnail${suffix}.png`);
  imgs.forEach(fs.unlinkSync);

  const metaFilepath = `${workDir}/desc${suffix}.txt`;
  const meta = metadata(audio, startIdx, nextVolIdx, volNum, numVols, durations);
  fs.writeFileSync(metaFilepath, meta);

  // remove downloaded source .wav files, to not clog local HD
  audioFsData.parts.forEach((p) => fs.rmSync(p.srcLocalPath));
}

async function capturePosterImages(
  audio: Audio,
  workDir: string,
  volNum: number,
  numVols: number,
  port: number,
): Promise<string[]> {
  const lang = audio.friend.lang;
  const path = audio.edition.path;
  const [makeScreenshot, closeHeadlessBrowser] = await posterApp.screenshot(port);

  async function saveScreenshot(path: string, filename: string): Promise<string> {
    const buff = await makeScreenshot(path);
    fs.outputFileSync(`${workDir}/${filename}`, buff, `binary`);
    return `${workDir}/${filename}`;
  }

  const coverQuery = `?vol=${volNum}&vols=${numVols}`;
  const imgs = [
    await saveScreenshot(`cover/${path}${coverQuery}`, `cover.png`),
    await saveScreenshot(`free-books/${lang}`, `free-books.png`),
    await saveScreenshot(`app-tease/${path}`, `app-tease.png`),
    await saveScreenshot(`continued/${lang}`, `goto-nextpart.png`),
  ];

  if (audio.parts.length > 1) {
    for (let i = 0; i < audio.parts.length; i++) {
      imgs.push(await saveScreenshot(`chapter/${path}/${i}`, `part-${i}.png`));
    }
  }

  await closeHeadlessBrowser();
  return imgs;
}
