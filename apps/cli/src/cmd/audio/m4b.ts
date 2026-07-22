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
  const document = audio.document;
  const friend = audio.friend;
  const shortTitle = utf8ShortTitle(document.title);
  const m4bDir = `${src.derivedPath}/m4b`;
  const relWorkDir = `Religion/${friend.name}/${shortTitle}`;
  const workDir = `${m4bDir}/${relWorkDir}`;
  const tmpDir = `${m4bDir}/tmp`;
  const isMultipart = audio.parts.length > 1;

  if (fs.existsSync(m4bDir)) {
    fs.rmSync(m4bDir, { recursive: true });
  }

  fs.ensureDirSync(workDir);
  fs.ensureDirSync(tmpDir);
  exec.exit(`cp ${src.derivedPath}/cover.png "${workDir}"`);
  fs.writeFileSync(`${workDir}/description.txt`, document.description);

  let durationAccum = 0;
  const chapterFileLines: string[] = [];

  for (const [idx, part] of src.parts.entries()) {
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
  }

  if (isMultipart) {
    const chaptersFilePath = `${workDir}/chapters.txt`;
    fs.writeFileSync(chaptersFilePath, chapterFileLines.join(`\n`));
  }

  const user = exec.exit(`echo "$(id -u):$(id -g)"`).trim();
  const dockerArgs = [
    `docker run`,
    `--rm`,
    `--user ${user}`,
    `--volume "${m4bDir}":/mnt`,
    `--env TMPDIR=/mnt/tmp`,
    IMAGE,
  ];

  const m4bToolArgs = [
    `merge`,
    `"${relWorkDir}"`,
    `--audio-channels=1`,
    `--audio-samplerate=48000`,
    `--audio-bitrate=${quality === `hq` ? `128k` : `48k`}`,
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

  exec.exit(`${dockerArgs.join(` `)} ${m4bToolArgs.join(` `)}`);
  const filename = `${src.hashedBasename}${quality === `lq` ? `--lq` : ``}.m4b`;
  exec.exit(`mv ${m4bDir}/merged.m4b ${src.derivedPath}/${filename}`);
}

export function ensureExists(): void {
  if (!exec.success(`docker --version`)) {
    red(`Docker required to run m4b-tool`);
    process.exit(1);
  }

  if (!exec.success(`docker image inspect ${IMAGE}`)) {
    red(`Missing docker image for ${IMAGE}.`);
    red(`  -> run \`docker pull ${IMAGE}\``);
    process.exit(1);
  }
}

const IMAGE = `sandreas/m4b-tool:2022-11-05`;

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
