import { execSync } from 'child_process';
import fs from 'fs-extra';
import env from '@friends-library/env';
import { deleteNamespaceDir } from '@friends-library/doc-artifacts';
import type { CommandBuilder, Arguments } from 'yargs';
import type { MakeOptions } from '../make/handler';
import type { DocPrecursor } from '@friends-library/types';
import { makeDpc } from '../make/handler';
import { builder as makeBuilder } from '../make';
import send from '../make/send';

export const command = `make:ref [basename]`;

export const describe = `make reference asciidoc document at given path`;

export const builder: CommandBuilder = async function (yargs) {
  if (typeof makeBuilder !== `function`) throw new Error(`Unexpected lack of builder fn`);
  return (await makeBuilder(yargs)).positional(`basename`, {
    type: `string`,
    default: `misc`,
    describe: `basename of reference doc (from packages/cli/src/make-ref)`,
  });
};

export async function handler(
  argv: Arguments<MakeOptions & { basename: string }>,
): Promise<void> {
  deleteNamespaceDir(`fl-make-ref`);
  const dpc = dpcFromPath(argv.basename, argv.isolate);
  const files = await makeDpc(dpc, { ...argv, skipLint: false }, `fl-make-ref`);
  !argv.noOpen && files.forEach((file) => execSync(`open "${file}"`));
  argv.send && send(files, argv.email);
}

function dpcFromPath(doc: string, isolate?: number): DocPrecursor {
  const { DEV_APPS_PATH } = env.require(`DEV_APPS_PATH`);
  const adocPath = `${DEV_APPS_PATH}/cli/src/cmd/make-ref/${doc}.adoc`;
  const dpc: DocPrecursor = {
    lang: `en`,
    path: `en/thomas-kite/ref-doc-${doc}/updated`,
    editionType: `updated`,
    blurb: ``,
    config: {},
    customCode: {
      css: { 'paperback-interior': `.chapter { page-break-before: avoid; }` },
      html: {},
    },
    paperbackSplits: [],
    asciidocFiles: [],
    documentSlug: `ref-doc`,
    isCompilation: false,
    outOfBand: false,
    friendSlug: `thomas-kite`,
    friendInitials: [`T`, `S`],
    editionId: `9986cb73-f240-4651-8c0c-636566f8c169`,
    meta: {
      title: `Reference Document`,
      isbn: `978-1-64476-000-0`,
      author: {
        name: `Thomas Kite`,
        nameSort: `Kite, Thomas`,
      },
    },
    revision: {
      timestamp: Math.floor(Date.now() / 1000),
      sha: `fb0c71b`,
      url: `https://github.com/ref/test/tree/fb0c71b/doc/edition`,
    },
  };

  const nextChapterContext: string[] = [];
  const allAdoc = fs.readFileSync(adocPath).toString();
  let chapters = allAdoc
    .split(/^(?=== )/gm)
    .reduce((acc, ch, idx) => {
      let trimmed = ch.trimEnd();
      const lines = trimmed.split(`\n`);
      let context: string | undefined = undefined;
      if (lines[lines.length - 1]!.match(/^\[.*\]$/)) {
        context = lines.pop();
        trimmed = lines.join(`\n`);
      }
      const chapter = `${nextChapterContext.shift() ?? ``}${trimmed}`;
      if (context) {
        nextChapterContext.push(`${context}\n`);
      }

      if (idx === 1) {
        acc[0] = `${acc[0] ? `${acc[0]}\n\n` : ``}${chapter}`;
      } else {
        acc.push(chapter);
      }
      return acc;
    }, [] as string[])
    .map((ch) => `${ch.trimEnd()}\n`);

  if (isolate && chapters[isolate - 1]) {
    chapters = [chapters[isolate - 1]!];
  }

  dpc.asciidocFiles = chapters.map((ch, idx) => ({
    adoc: ch,
    filename: `0${idx + 1}-misc.adoc`,
  }));

  return dpc;
}
