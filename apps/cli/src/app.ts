// @ts-nocheck
import '@friends-library/env/load';
import yargs from 'yargs';
import * as make from './cmd/make';
import * as cover from './cmd/cover';
import * as coverWatch from './cmd/cover-watch';
import * as publish from './cmd/publish';
import * as lint from './cmd/lint';
import * as unusual from './cmd/unusual';
import * as convert from './cmd/convert';
import * as chapterize from './cmd/chapterize';
import * as audio from './cmd/audio';
import * as video from './cmd/video';
import * as eachAdoc from './cmd/each-adoc';
import * as publishRef from './cmd/make-ref';
import * as docx from './cmd/docx';
import * as parse from './cmd/parse';
import * as artifactProductionVersion from './cmd/artifact-production-version';

/* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
yargs
  .scriptName(`fl`)
  .command(make)
  .command(cover)
  .command(coverWatch)
  .command(publish)
  .command(publishRef)
  .command(lint)
  .command(unusual)
  .command(chapterize)
  .command(convert)
  .command(audio)
  .command(video)
  .command(docx)
  .command(eachAdoc)
  .command(parse)
  .command(artifactProductionVersion)
  .help().argv;
