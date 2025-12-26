import '@friends-library/env/load';
import fs from 'fs';
import { exec } from 'child_process';
import env from '@friends-library/env';
import DevClient, { type T } from '@friends-library/pairql/dev';
import type { CoverProps } from '@friends-library/types';

async function main(): Promise<void> {
  const DOCS_ROOT = env.requireVar(`DOCS_REPOS_ROOT`);
  const friends = await getFriends();
  const map: Record<string, CoverProps> = {};
  const partTitles: Record<string, string[]> = {};

  for (const friend of friends) {
    for (const doc of friend.documents) {
      for (const edition of doc.editions.filter((e) => !e.isDraft && e.audioPartTitles)) {
        map[edition.path] = {
          lang: doc.lang,
          title: doc.title,
          isCompilation: doc.isCompilation,
          author: friend.name,
          size: edition.size ?? `m`,
          pages: edition.pages?.[0] ?? 222,
          edition: edition.type,
          isbn: edition.isbn ?? ``,
          blurb: doc.description,
          ...customCode(doc.directoryPath, DOCS_ROOT),
        };
        partTitles[edition.path] = edition.audioPartTitles ?? [];
      }
    }
  }

  fs.writeFileSync(
    `${__dirname}/cover-props.ts`,
    [
      `/* eslint-disable */`,
      `import { CoverProps } from '@friends-library/types';`,
      ``,
      `const map: Record<string, CoverProps | undefined> = ${JSON.stringify(map)}`,
      ``,
      `export default map;`,
    ].join(`\n`),
  );

  exec(`prettier --write ${__dirname}/cover-props.ts`);

  fs.writeFileSync(
    `${__dirname}/part-titles.ts`,
    [
      `/* eslint-disable */`,
      `const map: Record<string, string[]> = ${JSON.stringify(partTitles)}`,
      ``,
      `export default map;`,
    ].join(`\n`),
  );

  exec(`prettier --write ${__dirname}/part-titles.ts`);
}

function getFriends(): Promise<T.CoverWebAppFriends.Output> {
  if (process.argv.includes(`--empty`)) {
    return Promise.resolve([]);
  } else {
    return DevClient.node(process).coverWebAppFriends();
  }
}

function customCode(
  relPath: string,
  docsRoot: string,
): Pick<CoverProps, `customCss` | `customHtml`> {
  let customCss = ``;
  let customHtml = ``;
  const cssPath = `${docsRoot}/${relPath}/paperback-cover.css`;
  if (fs.existsSync(cssPath)) {
    customCss = fs.readFileSync(cssPath, `utf8`);
  }
  const htmlPath = `${docsRoot}/${relPath}/paperback-cover.html`;
  if (fs.existsSync(htmlPath)) {
    customHtml = fs.readFileSync(htmlPath, `utf8`);
  }
  return { customCss, customHtml };
}

main();
