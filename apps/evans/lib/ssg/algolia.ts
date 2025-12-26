import fs from 'fs';
import path from 'path';
import { safeLoad as ymlToJs } from 'js-yaml';
import algoliasearch from 'algoliasearch';
import { t, translateOptional } from '@friends-library/locale';
import { LANG } from '../env';
import { getFriendUrl } from '../../lib/friend';
import * as mdx from '../mdx';
import * as seo from '../seo';
import beliefsEn from './beliefs-search.en';
import beliefsEs from './beliefs-search.es';
import api, { type Api } from './api-client';
import invariant from '@/lib/invariant';
import { replacePlaceholders } from '@/components/mdx';

export default async function sendSearchDataToAlgolia(): Promise<void> {
  process.stdout.write(`Sending search data to Algolia...\n`);
  const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
  invariant(APP_ID, `algolia APP_ID env var missing`);
  invariant(ADMIN_KEY, `algolia ADMIN_KEY env var missing`);
  const client = algoliasearch(APP_ID, ADMIN_KEY);
  const [friends, documents, totalPublished] = await Promise.all([
    api.allFriendPages(LANG).then((map) => Object.values(map)),
    api.allDocumentPages(LANG).then((map) => Object.entries(map)),
    api.totalPublished(),
  ]);

  const friendsIndex = client.initIndex(`${LANG}_friends`);
  await friendsIndex.replaceAllObjects(friends.map(friendRecord));
  await friendsIndex.setSettings({
    paginationLimitedTo: 24,
    snippetEllipsisText: `[...]`,
    attributesToSnippet: [`description:30`],
    searchableAttributes: [`name`, `bookTitles`, `description`, `residences`],
  });

  const docsIndex = client.initIndex(`${LANG}_docs`);
  await docsIndex.replaceAllObjects(
    documents.map(([url, output]) => documentRecord(url, output.document)),
  );
  await docsIndex.setSettings({
    paginationLimitedTo: 24,
    snippetEllipsisText: `[...]`,
    attributesToSnippet: [`description:30`],
    searchableAttributes: [`title`, `originalTitle`, `description`, `authorName`],
  });

  const pagesIndex = client.initIndex(`${LANG}_pages`);
  await pagesIndex.replaceAllObjects(
    [
      ...mdxRecords(totalPublished),
      ...customPageRecords(totalPublished, friends),
      ...whatQuakersBelievedRecords(),
    ],
    { autoGenerateObjectIDIfNotExist: true },
  );
  await pagesIndex.setSettings({
    paginationLimitedTo: 24,
    snippetEllipsisText: `[...]`,
    attributesToSnippet: [`text:30`],
    searchableAttributes: [`title`, `subtitle`, `text`],
  });
  process.stdout.write(`Done sending Algolia search\n`);
}

function friendRecord(friend: Api.AllFriendPages.Output[string]): Record<string, string> {
  return {
    objectID: `friend--${friend.slug}`,
    name: friend.name,
    url: getFriendUrl(friend.slug, friend.gender),
    bookTitles:
      `“` +
      friend.documents.map((d) => convertEntities(d.htmlShortTitle)).join(`”, “`) +
      `”`,
    residences: friend.residences
      .map((r) => `${translateOptional(r.city)}, ${translateOptional(r.region)}`)
      .join(` — `),
    description: friend.description,
  };
}

function documentRecord(
  url: string,
  document: Api.DocumentPage.Output[`document`],
): Record<string, string | undefined> {
  return {
    objectID: `document--${document.ogImageUrl}`,
    title: convertEntities(document.htmlShortTitle),
    authorName: document.friendName,
    url: `/${url}`,
    originalTitle: document.originalTitle,
    description: document.description,
  };
}

function mdxRecords(counts: Api.TotalPublished.Output): Record<string, string | null>[] {
  const APP_ROOT = process.cwd();
  const files = mdx.fileData().filter((f) => f.lang === LANG);
  const pages: Array<[string, string | null]> = JSON.parse(
    fs.readFileSync(path.join(APP_ROOT, `static-pages.json`), `utf8`),
  );
  return files.flatMap(({ filepath, slug }) => {
    const content = fs.readFileSync(filepath).toString();
    const slugs = pages.find(([pageSlug]) => pageSlug === slug);
    invariant(slugs, `no mdx page matching file`);
    const localizedSlug = LANG === `en` ? slugs[0] : slugs[1];
    if (!localizedSlug) return []; // no spanish page for this english page
    const [, yaml, text] = content.split(/---\n/m);
    invariant(typeof yaml === `string`, `mdx content yaml not string`);
    invariant(typeof text === `string`, `mdx content text not string`);
    const frontmatter = ymlToJs(yaml);
    invariant(mdx.verifyFrontmatter(frontmatter), `invalid frontmatter`);
    const records: Record<string, string | null>[] = [
      {
        title: frontmatter.title,
        url: `/${localizedSlug}`,
        text: convertEntities(replacePlaceholders(frontmatter.description, counts)),
      },
    ];
    const paras = removeMarkdownFormatting(
      convertEntities(replacePlaceholders(text.trim(), counts)),
    )
      .split(`\n\n`)
      .map(sanitizeMdParagraph)
      .filter(Boolean);

    let currentSubtitle: null | string = null;
    for (const para of paras) {
      if (para.startsWith(`#`)) {
        currentSubtitle = para.replace(/^#+ /, ``);
        continue;
      }
      records.push({
        url: `/${localizedSlug}`,
        title: frontmatter.title,
        subtitle: currentSubtitle,
        text: para,
      });
    }
    return records;
  });
}

function customPageRecords(
  counts: Api.TotalPublished.Output,
  friends: Api.FriendPage.Output[],
): Record<string, string | null>[] {
  const replacements = {
    numAudiobooks: counts.audiobooks[LANG],
    numBooks: counts.books[LANG],
    numUpdatedEditions: friends
      .flatMap((friend) => friend.documents)
      .filter((document) => document.primaryEdition.type === `updated`).length,
    numFriends: friends.length,
  };
  return [
    {
      title: t`Audio Books`,
      url: t`/audiobooks`,
      text: seo.pageMetaDesc(`audiobooks`, replacements),
    },
    {
      title: t`Contact Us`,
      url: t`/contact`,
      text: seo.pageMetaDesc(`contact`, replacements),
    },
    {
      title: t`Explore Books`,
      url: t`/explore`,
      text: seo.pageMetaDesc(`explore`, replacements),
    },
    {
      title: t`All Friends`,
      url: t`/friends`,
      text: seo.pageMetaDesc(`friends`, replacements),
    },
    {
      title: t`Getting Started`,
      url: t`/getting-started`,
      text: seo.pageMetaDesc(`getting-started`, replacements),
    },
    {
      title: t`Friends Library App`,
      url: t`/app`,
      text: seo.pageMetaDesc(`app`, replacements),
    },
  ];
}

function convertEntities(input: string): string {
  return input
    .replace(/&mdash;/g, `—`)
    .replace(/&nbsp;/g, ` `)
    .replace(/&rsquo;/g, `’`)
    .replace(/&lsquo;/g, `‘`)
    .replace(/&rdquo;/g, `”`)
    .replace(/&ldquo;/g, `“`);
}

function removeMarkdownFormatting(md: string): string {
  return md
    .replace(/(\*\*|_)/g, ``)
    .replace(/^> /gm, ``)
    .replace(/{' '}/g, ``)
    .replace(/<.+?>/g, ``)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, `$1`);
}

function sanitizeMdParagraph(paragraph: string): string {
  return (
    paragraph
      .split(`\n`)
      .filter((l) => !l.match(/^<\/?Lead>/))
      .join(` `)
      // @ts-ignore - TS 5.5 / pnpm / monorepo ???
      .replace(/<AudioPlayer(.*)\n\/>$/gms, ``)
      .replace(/ {2,}/g, ` `)
      .replace(/^- /, ``)
      .trim()
  );
}

function whatQuakersBelievedRecords(): Record<string, string | null>[] {
  return [
    {
      title: t`Early Quaker Beliefs`,
      url: t`/what-early-quakers-believed`,
      text:
        LANG === `en`
          ? seo.QUAKER_BELIEFS_SEO_META_DESC_EN
          : seo.QUAKER_BELIEFS_SEO_META_DESC_ES,
    },
    ...(LANG === `en` ? beliefsEn : beliefsEs).map((chunk) => ({
      title: t`Early Quaker Beliefs`,
      subtitle: chunk.sectionTitle,
      url: `${t`/what-early-quakers-believed`}#${chunk.id}`,
      text: chunk.text,
    })),
  ];
}
