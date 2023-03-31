import os from 'os';
import fs from 'fs-extra';
import exec from 'x-exec';
import { red, c } from 'x-chalk';
import * as cloud from '@friends-library/cloud';
import { utf8ShortTitle } from '@friends-library/adoc-utils';
import type { AudioQuality } from '@friends-library/types';
import type { Audio } from './types';
import type { AudioFsData } from './types';
import * as ffmpeg from '../../ffmpeg';
import { logAction } from '../../sub-log';
import { suffixThe } from './tags';

export async function create(
  audio: Audio,
  src: AudioFsData,
  quality: AudioQuality,
): Promise<void> {
  const edition = audio.edition;
  const document = edition.document;
  const friend = document.friend;
  const shortTitle = utf8ShortTitle(document.title);
  const m4bDir = `${src.derivedPath}/m4b`;
  const relWorkDir = `Religion/${friend.name}/${shortTitle}`;
  const workDir = `${m4bDir}/${relWorkDir}`;
  const isMultipart = audio.parts.length > 1;

  if (fs.existsSync(m4bDir)) {
    fs.rmSync(m4bDir, { recursive: true });
  }

  fs.ensureDirSync(workDir);
  exec.exit(`cp ${src.derivedPath}/cover.png "${workDir}"`);
  fs.writeFileSync(`${workDir}/description.txt`, document.description);

  let durationAccum = 0;
  const chapterFileLines: string[] = [];

  src.parts.forEach(async (part, idx) => {
    chapterFileLines.push(`${secsToStr(durationAccum)} ${audio.parts[idx]!.title}`);
    if (!fs.existsSync(part.srcLocalPath)) {
      logAction(`downloading source .wav file ${c`{cyan pt. ${idx + 1}}`} for m4b`);
      const buffer = await cloud.downloadFile(part.srcCloudPath);
      fs.writeFileSync(part.srcLocalPath, buffer);
    }

    exec.exit(`cp ${part.srcLocalPath} "${workDir}"`);
    if (isMultipart && idx < src.parts.length - 1) {
      const [, duration] = ffmpeg.getDuration(part.srcLocalPath);
      durationAccum += duration;
    }
  });

  if (isMultipart) {
    const chaptersFilePath = `${workDir}/chapters.txt`;
    fs.writeFileSync(chaptersFilePath, chapterFileLines.join(`\n`));
  }

  const m4bToolArgs = [
    `merge`,
    `"${relWorkDir}"`,
    `--audio-channels=1`,
    `--audio-samplerate=48000`,
    `--audio-bitrate=${quality === `HQ` ? `128k` : `48k`}`,
    `--output-file="merged.m4b"`,
    `--name="${shortTitle}"`,
    `--sortname="${suffixThe(shortTitle)}"`,
    `--album="${shortTitle}"`,
    `--sortalbum="${suffixThe(shortTitle)}"`,
    `--genre=Religion`,
    `--jobs=${os.cpus().length - 1}`,
    `--artist="${friend.name}"`,
    `--sortartist="${friend.alphabeticalName}"`,
  ];

  exec.exit(`m4b-tool ${m4bToolArgs.join(` `)}`, m4bDir);
  const filename = `${src.hashedBasename}${quality === `LQ` ? `--lq` : ``}.m4b`;
  exec.exit(`mv ${m4bDir}/merged.m4b ${src.derivedPath}/${filename}`);
}

export function ensureExists(): void {
  if (!exec.success(`which m4b-tool`)) {
    red(`Missing required binary 'm4b-tool'.`);
    red(`Install directions at https://github.com/sandreas/m4b-tool`);
    red(`Don't use docker, install with homebrew.`);
    red(`Repo is forked into jaredh159 if needed.`);
    process.exit(1);
  }
}

/**
 * Takes a duration in seconds (3114.05) and returns
 * a ffmpeg-like duration string "00:51:54.05"
 */
function secsToStr(duration: number): string {
  const hours = Math.floor(duration / (60 * 60));
  const minutesSeconds = duration - hours * 60 * 60;
  const minutes = Math.floor(minutesSeconds / 60);
  const seconds = minutesSeconds - minutes * 60;
  const hoursStr = String(hours).padStart(2, `0`);
  const minutesStr = String(minutes).padStart(2, `0`);
  const secondsStr = seconds.toFixed(2).padStart(5, `0`);
  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}
