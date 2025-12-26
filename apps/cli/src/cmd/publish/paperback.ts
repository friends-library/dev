import fs from 'fs-extra';
import parsePdf from 'pdf-parse';
import { sizes } from '@friends-library/lulu';
import { log, c } from 'x-chalk';
import * as artifacts from '@friends-library/doc-artifacts';
import { evaluate } from '@friends-library/evaluator';
import { PRINT_SIZE_VARIANTS } from '@friends-library/types';
import { paperbackInterior as paperbackManifest } from '@friends-library/doc-manifests';
import type { PrintSizeVariant, PrintSize } from '@friends-library/types';
import type { FsDocPrecursor } from '@friends-library/dpc-fs';
import type { T } from '../../api-client';
import { logDebug } from '../../sub-log';

type SinglePages = { [K in PrintSizeVariant]: number };
type SingleFiles = { [K in PrintSizeVariant]: string };
type MultiPages = Omit<{ [K in PrintSizeVariant]: number[] }, `s`> | undefined;
type MultiFiles = Omit<{ [K in PrintSizeVariant]: string[] }, `s`> | undefined;

export async function publish(
  dpc: FsDocPrecursor,
  opts: { namespace: string; srcPath: string },
): Promise<{
  printSize: PrintSize;
  printSizeVariant: PrintSizeVariant;
  volumes: number[];
  paths: string[];
}> {
  const [singlePages, singleFiles] = await makeSingleVolumes(dpc, opts);

  let splitPages: MultiPages = undefined;
  let splitFiles: MultiFiles = undefined;

  if (!canSkipMultiVolumeCheck(singlePages)) {
    [splitPages, splitFiles] = await makeMultiVolumes(dpc, opts);
  } else {
    logDebug(`Skipping unneeded multi-volume page size check`);
  }

  let size: PrintSize = dpc.printSize || `s`;
  let condense = false;
  if (!dpc.printSize) {
    try {
      [size, condense] = choosePrintSize(singlePages, splitPages);
    } catch {
      throw new Error(`${dpc.path} exceeds max allowable size, must be split`);
    }
  }

  const sizeVariant = `${size}${condense ? `--condensed` : ``}` as PrintSizeVariant;
  let volumes = [singlePages[sizeVariant]];
  if (splitPages && sizeVariant !== `s`) {
    volumes = splitPages[sizeVariant];
  }

  const paths =
    splitFiles && sizeVariant !== `s`
      ? splitFiles[sizeVariant]
      : [singleFiles[sizeVariant]];

  return {
    printSize: size,
    printSizeVariant: sizeVariant,
    volumes,
    paths,
  };
}

export function editionChapters(dpc: FsDocPrecursor): T.CreateEditionChapters.Input {
  return evaluate.toPdfSrcHtml(dpc).chapters.map((chapterResult, index) => ({
    editionId: dpc.editionId,
    order: index + 1,
    shortHeading: chapterResult.shortHeading,
    isIntermediateTitle: chapterResult.isIntermediateTitle,
    sequenceNumber: chapterResult.sequenceNumber,
    nonSequenceTitle: chapterResult.nonSequenceTitle,
    customId: chapterResult.id === chapterResult.slug ? undefined : chapterResult.id,
  }));
}

async function makeSingleVolumes(
  dpc: FsDocPrecursor,
  opts: { namespace: string; srcPath: string },
): Promise<[SinglePages, SingleFiles]> {
  logDebug(`Determining paperback interior page counts...`);
  const pages: SinglePages = { s: 0, m: 0, xl: 0, 'xl--condensed': 0 };
  const files: SingleFiles = { s: ``, m: ``, xl: ``, 'xl--condensed': `` };

  const variants = [...PRINT_SIZE_VARIANTS];
  let variant: PrintSizeVariant | undefined = undefined;
  while ((variant = variants.shift())) {
    log(c`     {magenta.dim ->} {gray size:} {cyan ${variant}}`);
    const size = variant === `xl--condensed` ? `xl` : variant;
    const [manifest = {}] = await paperbackManifest(dpc, {
      printSize: size,
      frontmatter: true,
      allowSplits: false,
      condense: variant === `xl--condensed`,
    });

    const file = filename(dpc, variant);
    const filepath = await artifacts.pdf(manifest, file, opts);
    files[variant] = filepath;
    pages[variant] = await getPages(filepath);
    if (canSkipLargerSizes(variant, pages, dpc.printSize)) {
      logDebug(`Skipping unneeded page size checks: [${variants.join(`, `)}]`);
      return [pages, files];
    }
  }

  return [pages, files];
}

async function makeMultiVolumes(
  dpc: FsDocPrecursor,
  opts: { namespace: string; srcPath: string },
): Promise<[MultiPages, MultiFiles]> {
  const pages: MultiPages = { m: [], xl: [], 'xl--condensed': [] };
  const files: MultiFiles = { m: [], xl: [], 'xl--condensed': [] };

  logDebug(`Determining paperback interior page counts for split faux-volumes...`);
  for (const variant of [`m`, `xl`, `xl--condensed`] as const) {
    log(c`     {magenta.dim ->} {gray size (split):} {cyan ${variant}}`);
    const size = variant === `xl--condensed` ? `xl` : variant;
    const manifests = await paperbackManifest(dpc, {
      printSize: size,
      frontmatter: true,
      allowSplits: true,
      condense: variant === `xl--condensed`,
    });

    for (let idx = 0; idx < manifests.length; idx++) {
      const manifest = manifests[idx]!;
      const vol = idx + 1;
      const volFilename = filename(dpc, variant, vol);
      const filepath = await artifacts.pdf(manifest, volFilename, opts);
      files[variant].push(filepath);
      pages[variant].push(await getPages(filepath));
    }
  }

  return [pages, files];
}

async function getPages(path: string): Promise<number> {
  const buffer = await fs.readFile(path);
  const { numpages } = await parsePdf(buffer, { max: 1 });
  return numpages;
}

function filename(dpc: FsDocPrecursor, variant: string, volumeNumber?: number): string {
  return [
    dpc.friendInitials.join(``),
    dpc.documentSlug,
    dpc.editionType,
    dpc.editionId.substring(0, 8),
    variant,
    volumeNumber,
    `paperback-interior`,
  ]
    .filter((part) => !!part)
    .join(`--`);
}

function canSkipLargerSizes(
  variant: PrintSizeVariant,
  pages: SinglePages,
  overridePrintSize?: PrintSize,
): boolean {
  if (variant === `xl--condensed`) {
    return false;
  }

  if (typeof pages[variant] !== `number` || pages[variant] === 0) {
    return false;
  }

  if (overridePrintSize && variant !== overridePrintSize) {
    return false;
  }

  try {
    const [size, condense] = choosePrintSize(pages, undefined);
    return size === variant && condense === false;
  } catch {
    return false;
  }
}

function canSkipMultiVolumeCheck(single: SinglePages): boolean {
  return single.m === 0 || single.xl < 600 || single[`xl--condensed`] < 600;
}

export function choosePrintSize(
  singlePages: SinglePages,
  splitPages: MultiPages,
): [PrintSize, boolean] {
  if (splitPages) {
    const numVols = splitPages.m.length;
    const average = {
      s: Infinity,
      m: splitPages.m.reduce(add) / numVols,
      xl: splitPages.xl.reduce(add) / numVols,
      'xl--condensed': splitPages[`xl--condensed`].reduce(add) / numVols,
    };
    return choosePrintSize(average, undefined);
  }

  if (singlePages.s <= sizes.s.maxPages) {
    return [`s`, NOT_CONDENSED];
  }

  if (singlePages.m <= sizes.m.maxPages) {
    return [`m`, NOT_CONDENSED];
  }

  if (singlePages.xl <= CONDENSE_THRESHOLD) {
    return [`xl`, NOT_CONDENSED];
  }

  if (singlePages[`xl--condensed`] > sizes.xl.maxPages) {
    throw new RangeError(`Max book size exceeded`);
  }

  return [`xl`, CONDENSED];
}

function add(a: number, b: number): number {
  return a + b;
}

const CONDENSE_THRESHOLD = 650;
const CONDENSED = true;
const NOT_CONDENSED = false;
