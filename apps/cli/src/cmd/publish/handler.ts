import { dirname } from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import { log, c as cl, red } from 'x-chalk';
import isEqual from 'lodash.isequal';
import * as cloud from '@friends-library/cloud';
import slack from '@friends-library/slack';
import * as artifacts from '@friends-library/doc-artifacts';
import * as manifest from '@friends-library/doc-manifests';
import { appEbook as appEbookCss } from '@friends-library/doc-css';
import { hydrate, query as dpcQuery } from '@friends-library/dpc-fs';
import { ParserError } from '@friends-library/parser';
import { toDbPrintSizeVariant } from '@friends-library/types';
import type { FsDocPrecursor } from '@friends-library/dpc-fs';
import type { DocPrecursor } from '@friends-library/types';
import type { ScreenshotTaker } from './cover-server';
import type { CloudFiles, PendingUploads, PublishData } from './types';
import { logAction, logDebug, logError } from '../../sub-log';
import api from '../../api-client';
import * as coverServer from './cover-server';
import validate from './validate';
import { logDocStart, logDocComplete, logPublishComplete, logPublishStart } from './log';
import * as paperback from './paperback';
import * as git from './git';
import { emptyPendingUploads } from './types';

interface PublishOptions {
  check: boolean;
  pattern?: string;
  coverServerPort?: number;
  allowStatus: boolean;
  draft: boolean;
  force: boolean;
  slack: boolean;
}

export default async function publish(argv: PublishOptions): Promise<void> {
  if (!argv.allowStatus && !git.cliStatusClean()) {
    log(cl`\n{red.bold Error: git status not clean} {gray --allow-status to override}\n`);
    process.exit(1);
  }

  logPublishStart();

  const [COVER_PORT, productionRevision] = await Promise.all([
    argv.coverServerPort ? Promise.resolve(argv.coverServerPort) : coverServer.start(),
    api.latestArtifactProductionVersion().then(({ version }) => version),
  ]);

  const [makeScreenshot, closeHeadlessBrowser] = await coverServer.screenshot(COVER_PORT);
  const dpcs = await dpcQuery.getByPattern(argv.pattern);
  dpcs.sort((a, b) => (a.path < b.path ? -1 : 1));
  const errors: string[] = [];
  const successes: string[] = [];

  for (let i = 0; i < dpcs.length; i++) {
    const dpc = dpcs[i]!;
    const assetStart = Date.now();
    const progress = cl`{gray (${String(i + 1)}/${String(dpcs.length)})}`;

    try {
      logDocStart(dpc, progress);
      const data = await initialData(dpc);

      if (!argv.force && shouldSkip(data, productionRevision)) {
        logDebug(`re-publish not needed, skipping`);
        continue;
      }

      if (data.edition.isDraft && argv.draft) {
        logAction(`publishing draft edition due to --draft flag`);
      } else if (data.edition.isDraft) {
        logDebug(`edition is draft, skipping`);
        continue;
      }

      hydrate.all([dpc]);
      await validate(dpc);
      artifacts.deleteNamespaceDir(data.artifactOptions.namespace);
      fillInKnownEntityData(data, productionRevision);
      await handleAppEbook(data, i);
      await handlePaperbackAndCover(data);
      await handleWebPdf(data);
      await handleEbooks(data, makeScreenshot);
      await handle3dPaperbackCoverImages(data, makeScreenshot);
      await handleSquareCoverImages(data, makeScreenshot);
      await handleSpeech(data);

      logDebug(`Saving EditionImpression...`);
      const cloudPaths = await saveEditionImpression(data.impression);

      logDebug(`Replacing EditionChapters...`);
      await replaceEditionChapters(dpc);

      logDebug(`Uploading generated files to cloud storage...`);
      await uploadFiles(data.uploads, cloudPaths);

      successes.push(dpc.path);
    } catch (err) {
      if (err instanceof ParserError || `codeFrame` in (err as any)) {
        console.log((err as any).codeFrame);
        errors.push(`${dpc.path} ${(err as any).codeFrame}`);
      } else {
        red(err);
        errors.push(`${dpc.path} ${err}`);
      }
    }

    logDocComplete(dpc, assetStart, progress);
  }

  if (!argv.coverServerPort) coverServer.stop(COVER_PORT);
  await closeHeadlessBrowser();
  logPublishComplete();

  if (argv.slack) {
    await slackNotify(successes, errors);
  }

  if (errors.length) {
    red(`Encountered ${errors.length} errors:\n`);
    red(`\t${errors.join(`\n\t`)}`);
    process.exit(1);
  }
}

async function initialData(dpc: FsDocPrecursor): Promise<PublishData> {
  const edition = await api.getEdition(dpc.editionId);
  const fileId = getFileId(dpc);
  const previousImpression = edition.impression
    ? {
        id: edition.impression.id,
        editionId: dpc.editionId,
        adocLength: edition.impression.adocLength,
        paperbackSizeVariant: edition.impression.paperbackSizeVariant,
        paperbackVolumes: edition.impression.paperbackVolumes,
        publishedRevision: edition.impression.publishedRevision,
        productionToolchainRevision: edition.impression.productionToolchainRevision,
      }
    : null;

  const currentImpression = previousImpression
    ? { ...previousImpression }
    : {
        id: uuid(),
        editionId: dpc.editionId,
        adocLength: -1,
        paperbackSizeVariant: `m` as const,
        paperbackVolumes: [],
        publishedRevision: ``,
        productionToolchainRevision: ``,
      };

  return {
    dpc,
    edition,
    uploads: emptyPendingUploads(),
    artifactOptions: { namespace: `fl-publish/${fileId}`, srcPath: fileId },
    impression: { current: currentImpression, previous: previousImpression },
  };
}

async function handleAppEbook(
  { dpc, uploads, artifactOptions: opts }: PublishData,
  index: number,
): Promise<void> {
  logDebug(`Creating app-ebook artifact...`);
  const [appEbookManifest] = await manifest.appEbook(dpc);
  const filenameNoExt = getFileId(dpc, `app-ebook`);

  const path = await artifacts.appEbook(appEbookManifest!, filenameNoExt, opts);
  uploads.ebook.app = path;

  // create and upload the shared app-ebook css only once
  if (index === 0) {
    const rootPublishDir = dirname(dirname(path));
    const cssPath = `${rootPublishDir}/_app-ebook.css`;
    fs.ensureDirSync(rootPublishDir);
    fs.writeFileSync(cssPath, appEbookCss());
    uploads.ebook.appCss = cssPath;
  }
}

async function handleSquareCoverImages(
  { dpc, edition, artifactOptions: opts, uploads }: PublishData,
  makeScreenshot: ScreenshotTaker,
): Promise<void> {
  logDebug(`Creating square cover images...`);
  const dirname = artifacts.dirs(opts).ARTIFACT_DIR;
  fs.ensureDirSync(dirname);
  const buffer = await makeScreenshot(dpc.path, `audio`);
  const largestWidth = edition.allSquareImages
    .map(({ width }) => width)
    .sort((a, b) => b - a)[0]!;
  uploads.images.square = await Promise.all(
    edition.allSquareImages
      .map(({ width, filename, path }) => ({
        width,
        localPath: `${dirname}/${filename}`,
        cloudPath: path,
      }))
      .map(async ({ width, localPath, cloudPath }) => {
        if (width === largestWidth) {
          await fs.writeFile(localPath, buffer);
        } else {
          await sharp(buffer).resize(width).toFile(localPath);
        }
        return { localPath, cloudPath };
      }),
  );
}

async function handle3dPaperbackCoverImages(
  { dpc, edition, uploads, artifactOptions: opts }: PublishData,
  makeScreenshot: ScreenshotTaker,
): Promise<void> {
  logDebug(`Creating 3d cover images...`);
  const dirname = artifacts.dirs(opts).ARTIFACT_DIR;
  fs.ensureDirSync(dirname);
  const buffer = await makeScreenshot(dpc.path, `threeD`);
  const largestWidth = edition.allThreeDImages
    .map(({ width }) => width)
    .sort((a, b) => b - a)[0]!;
  uploads.images.threeD = await Promise.all(
    edition.allThreeDImages
      .map(({ width, filename, path }) => ({
        width,
        localPath: `${dirname}/${filename}`,
        cloudPath: path,
      }))
      .map(async ({ width, localPath, cloudPath }) => {
        if (width === largestWidth) {
          await fs.writeFile(localPath, buffer);
        } else {
          await sharp(buffer).resize(width).toFile(localPath);
        }
        return { localPath, cloudPath };
      }),
  );
}

async function handleWebPdf(data: PublishData): Promise<void> {
  logDebug(`Creating web-pdf artifact...`);
  const [webManifest] = await manifest.webPdf(data.dpc);
  const filename = getFileId(data.dpc, `web-pdf`);
  const path = await artifacts.pdf(webManifest!, filename, data.artifactOptions);
  data.uploads.ebook.pdf = path;
}

async function handleSpeech(data: PublishData): Promise<void> {
  logDebug(`Creating speech artifact...`);
  const [speechManifest] = await manifest.speech(data.dpc);
  const filename = getFileId(data.dpc, `speech`);
  const path = await artifacts.speech(speechManifest!, filename, data.artifactOptions);
  data.uploads.ebook.speech = path;
}

async function handlePaperbackAndCover(data: PublishData): Promise<void> {
  logDebug(`Starting paperback interior generation...`);
  const published = await paperback.publish(data.dpc, data.artifactOptions);
  data.uploads.paperback.interior = published.paths;
  data.impression.current.paperbackSizeVariant = toDbPrintSizeVariant(
    published.printSizeVariant,
  );
  data.impression.current.paperbackVolumes = published.volumes;

  const coverManifests = await manifest.paperbackCover(data.dpc, {
    printSize: published.printSize,
    volumes: published.volumes,
  });

  for (let idx = 0; idx < coverManifests.length; idx++) {
    const manifest = coverManifests[idx];
    const vols = coverManifests.length > 1 ? [`v${idx + 1}`] : [];
    const filenameNoExt = getFileId(data.dpc, `paperback-cover`, ...vols);
    const path = await artifacts.pdf(manifest!, filenameNoExt, data.artifactOptions);
    data.uploads.paperback.cover.push(path);
  }
}

async function handleEbooks(
  { dpc, uploads, artifactOptions: opts }: PublishData,
  makeScreenshot: ScreenshotTaker,
): Promise<void> {
  const coverImg = await makeScreenshot(dpc.path, `ebook`);
  // to get a cover image .png file, see epub src files in `artifacts` dir after publish
  const config = { coverImg, frontmatter: true };
  const base = getFileId(dpc, `ebook`);

  logDebug(`Creating epub artifact...`);
  const [epubMan = {}] = await manifest.epub(dpc, { ...config, subType: `epub` });
  const epub = await artifacts.create(`epub`, epubMan, base, { ...opts, check: true });
  uploads.ebook.epub = epub;

  logDebug(`Creating mobi artifact...`);
  const [mobiMan = {}] = await manifest.mobi(dpc, { ...config, subType: `mobi` });
  const mobi = await artifacts.create(`mobi`, mobiMan, base, { ...opts, check: false });
  uploads.ebook.mobi = mobi;
}

function getFileId(dpc: DocPrecursor, ...additionalSegments: string[]): string {
  return [
    dpc.friendInitials.join(``),
    dpc.documentSlug,
    dpc.editionType,
    dpc.editionId.substring(0, 8),
    ...additionalSegments,
  ].join(`--`);
}

function shouldSkip({ edition, dpc }: PublishData, prodVersion: string): boolean {
  if (!edition.impression) {
    // first-time publish
    return false;
  }

  if (prodVersion !== edition.impression.productionToolchainRevision) {
    return false;
  }

  const docSha = git.dpcDocumentCurrentSha(dpc);
  if (docSha !== edition.impression.publishedRevision) {
    return false;
  }

  return true;
}

async function slackNotify(successes: string[], errors: string[]): Promise<void> {
  if (errors.length > 0) {
    const errorData = { errors: safeSlackJson(errors) };
    await slack.error(`${errors.length} errors publishing documents`, errorData);
  }
  if (successes.length > 0) {
    const published = { published: safeSlackJson(successes) };
    await slack.info(
      `Successfully published ${successes.length} documents`,
      published,
      `:books:`,
    );
  }
}

function safeSlackJson(strings: string[]): string[] {
  const safeJson: string[] = [];
  for (let i = 0; i < strings.length; i++) {
    const stringified = JSON.stringify(safeJson);
    if (stringified.length > 2900) {
      safeJson.push(`...and ${strings.length - 1 - i} more...`);
      return safeJson;
    }
    safeJson.push(strings[i]!);
  }
  return safeJson;
}

function fillInKnownEntityData(
  { impression: { current }, dpc }: PublishData,
  productionToolchainRevision: string,
): void {
  current.adocLength = dpc.asciidocFiles.reduce((acc, { adoc }) => acc + adoc.length, 0);
  current.publishedRevision = git.dpcDocumentCurrentSha(dpc);
  current.productionToolchainRevision = productionToolchainRevision;
}

async function saveEditionImpression(
  impression: PublishData['impression'],
): Promise<CloudFiles> {
  if (isEqual(impression.current, impression.previous)) {
    logDebug(`skipping save EditionImpression, all properties unchanged...`);
    return (await api.getEditionImpression(impression.current.id)).cloudFiles;
  }
  const result = await api.upsertEditionImpressionResult(impression.current);
  return result.mapOrRethrow(
    (i) => i.cloudFiles,
    async (err) => {
      await rollbackSaveEditionImpression(impression);
      throw new Error(`failed to save EditionImpression, error=${JSON.stringify(err)}`);
    },
  );
}

async function rollbackSaveEditionImpression(
  impression: PublishData['impression'],
): Promise<void> {
  logAction(`attempting to roll back save EditionImpression...`);

  // in case the problem caused the server to crash, give time for it to restart...
  await new Promise((res) => setTimeout(res, 5000));

  try {
    if (!impression.previous) {
      const id = impression.current.id;
      await api.deleteEntities({ case: `editionImpression`, id });
    } else {
      await api.upsertEditionImpression(impression.previous);
    }
    logAction(`rolled back save EditionImpression successfully`);
  } catch (err) {
    logError(`error rolling back save EditionImpression, error=${JSON.stringify(err)}`);
  }
}

async function uploadFiles(
  uploads: PendingUploads,
  cloudPaths: CloudFiles,
): Promise<void> {
  const files = new Map<string, string>();
  files.set(uploads.ebook.epub, cloudPaths.epub);
  files.set(uploads.ebook.mobi, cloudPaths.mobi);
  files.set(uploads.ebook.pdf, cloudPaths.pdf);
  files.set(uploads.ebook.speech, cloudPaths.speech);
  files.set(uploads.ebook.app, cloudPaths.app);

  uploads.images.square.forEach(({ localPath, cloudPath }) =>
    files.set(localPath, cloudPath),
  );

  uploads.images.threeD.forEach(({ localPath, cloudPath }) =>
    files.set(localPath, cloudPath),
  );

  if (uploads.ebook.appCss) {
    files.set(uploads.ebook.appCss, `static/app-ebook.css`);
  }

  if (
    uploads.paperback.cover.length !== uploads.paperback.interior.length ||
    cloudPaths.paperbackCover.length !== cloudPaths.paperbackInterior.length ||
    uploads.paperback.cover.length !== cloudPaths.paperbackCover.length
  ) {
    throw new Error(`Unmatched paperback volume numbers`);
  }

  for (let index = 0; index < uploads.paperback.cover.length; index++) {
    files.set(uploads.paperback.cover[index]!, cloudPaths.paperbackCover[index]!);
    files.set(uploads.paperback.interior[index]!, cloudPaths.paperbackInterior[index]!);
  }

  await cloud.uploadFiles(files);
}

async function replaceEditionChapters(dpc: FsDocPrecursor): Promise<void> {
  const deleteRes = await api.deleteEntitiesResult({
    case: `editionChapters`,
    id: dpc.editionId,
  });
  if (deleteRes.isError) {
    throw new Error(
      `Error deleting existing EditionChapter entities for ${dpc.path}, (${deleteRes.error})`,
    );
  }
  const inputs = paperback.editionChapters(dpc);
  const createRes = await api.createEditionChaptersResult(inputs);
  if (createRes.isError) {
    throw new Error(
      `Error creating EditionChapter entities for ${dpc.path}, (${createRes.error})`,
    );
  }
}
