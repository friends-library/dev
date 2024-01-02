import { dirname, basename } from 'path';
import fs from 'fs-extra';
import { red } from 'x-chalk';
import exec from 'x-exec';
import type { AudioQuality } from '@friends-library/types';
import type { Audio } from './cmd/audio/types';
import { getPartTags } from './cmd/audio/tags';

export function makeVideo(
  workDir: string,
  wavFilename: string,
  outputFilename: string,
): void {
  const args = [
    `-y`, // overwrite existing output file
    `-f concat -i slides.txt`, // concat still photos from instruction file
    `-i ${wavFilename}`, // add wav file source
    `-vsync vfr`, // no clue
    `-pix_fmt yuv420p`, // output format?
    outputFilename,
  ];
  ffmpeg(args, workDir);
}

export function joinWavs(
  workDir: string,
  wavSrcPaths: string[],
  outputFilename: string,
): string {
  wavSrcPaths.forEach((path) => exec.exit(`cp ${path} ${workDir}/`));
  const fileLines = wavSrcPaths.map((path) => `file '${basename(path)}'`);
  fs.writeFileSync(`${workDir}/join-wavs.txt`, fileLines.join(`\n`));
  const ffmpegArgs = [
    `-y`, // overwrite existing output file
    `-f concat -i join-wavs.txt`, // concat wav files from instruction file
    `-c copy`,
    outputFilename,
  ];
  ffmpeg(ffmpegArgs, workDir);
  fs.unlinkSync(`${workDir}/join-wavs.txt`);
  wavSrcPaths.map((path) => fs.unlinkSync(`${workDir}/${basename(path)}`));
  return `${workDir}/${outputFilename}`;
}

export function createMp3(
  audio: Audio,
  partIndex: number,
  srcPath: string,
  destPath: string,
  quality: AudioQuality,
): void {
  const destDir = dirname(destPath);
  const srcCopyPath = `${destDir}/${basename(srcPath)}`;
  exec.exit(`cp ${srcPath} ${srcCopyPath}`);

  const ffmpegArgs = [
    `-i ${basename(srcCopyPath)}`, // input file
    `-i cover.png -map 0:0 -map 1:0`, // cover image
    `-c copy -id3v2_version 3`, // cover image, continued
    `-metadata:s:v title="Album cover"`, // cover image, continued
    `-metadata:s:v comment="Cover (front)"`, // cover image, continued
    `-codec:a libmp3lame`, // specify audio codec
    getTagArgs(audio, partIndex), // mp3 tags
    quality === `lq`
      ? `-b:a 40k` // 40kb CBR encoding
      : `-qscale:a 5`, // VBR quality 5 encoding
    `${basename(destPath)}`, // output file
  ];

  ffmpeg(ffmpegArgs, destDir);

  exec.exit(`rm ${srcCopyPath}`);
}

export function getDuration(wavFilepath: string): [string, number] {
  if (!fs.existsSync(wavFilepath)) {
    throw new Error(`Can't get duration, missing src wav ${wavFilepath}`);
  }
  const [err] = ffmpeg([`-i ${basename(wavFilepath)}`], dirname(wavFilepath), false);
  if (!err) {
    throw new Error(`Unexpected ouput for reading duration string.`);
  }
  const lines = err.stdErr.split(`\n`);
  for (const line of lines) {
    if (line.trim().startsWith(`Duration: `)) {
      const str = line.replace(/ +Duration: (([^,])+)/, `$1`).replace(/,.*/, ``);
      const [hours = 0, minutes = 0, seconds = 0] = str.split(`:`).map(parseFloat);
      // prettier-ignore
      const num = seconds + (minutes * 60) + (hours * 60 * 60);
      return [str, num];
    }
  }
  throw new Error(`Duration not found for path: ${wavFilepath}`);
}

function ffmpeg(
  ffmpegArgs: string[],
  hostDir: string,
  throwErr = true,
): ReturnType<typeof exec> {
  const user = exec.exit(`echo "$(id -u):$(id -g)"`).trim();
  const dockerArgs = [
    `docker run`,
    `--rm`,
    `--user ${user}`,
    `--workdir /tmp/workdir`,
    `--volume ${hostDir}:/tmp/workdir`,
    IMAGE,
  ];
  const [err, output] = exec(`${dockerArgs.join(` `)} ${ffmpegArgs.join(` `)}`);
  if (err && throwErr) {
    throw new Error(`ffmpeg error: ${output}`);
  }
  return [err, output];
}

function getTagArgs(audio: Audio, partIndex: number): string {
  return Object.entries(getPartTags(audio, partIndex))
    .map(([key, val]) => `-metadata ${key}="${val}"`)
    .join(` `);
}

export function ensureExists(): void {
  if (!exec.success(`docker --version`)) {
    red(`Docker required to run ffmpeg`);
    process.exit(1);
  }

  if (!exec.success(`docker image inspect ${IMAGE}`)) {
    exec.exit(`docker pull ${IMAGE}`);
  }

  exec.exit(`docker image inspect ${IMAGE}`);
}

const IMAGE = `sandreas/ffmpeg:5.0.1-3`;
