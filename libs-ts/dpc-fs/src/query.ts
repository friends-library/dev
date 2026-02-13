import '@friends-library/env/load';
import env from '@friends-library/env';
import DevClient, { type T } from '@friends-library/pairql/dev';
import type { FsDocPrecursor } from './types';

export async function getByPattern(pattern?: string): Promise<FsDocPrecursor[]> {
  const DOCS_REPOS_ROOT = env.requireVar(`DOCS_REPOS_ROOT`);

  // special case: prevent non-match when running cli commands like `fl make` with full paths
  if (pattern && DOCS_REPOS_ROOT.length > 4) {
    pattern = pattern.replace(`${DOCS_REPOS_ROOT}/`, ``);
  }

  return (await DevClient.node(process).dpcEditionsResult()).mapOrRethrow(
    (editions) =>
      editions
        .filter((edition) => !pattern || edition.directoryPath.includes(pattern))
        .map((edition) => editionToFsDpc(edition, DOCS_REPOS_ROOT)),
    (error) => {
      throw new Error(`Error querying editions: ${JSON.stringify(error)}`);
    },
  );
}

function editionToFsDpc(
  edition: T.DpcEditions.Output[number],
  docsRoot: string,
): FsDocPrecursor {
  return {
    lang: edition.friend.lang === `es` ? `es` : `en`,
    friendSlug: edition.friend.slug,
    friendInitials: edition.friend.slug.split(`-`).map((s) => (s[0] ?? ``).toUpperCase()),
    documentSlug: edition.document.slug,
    fullPath: `${docsRoot}/${edition.directoryPath}`,
    path: edition.directoryPath,
    editionId: edition.id,
    isCompilation: edition.friend.isCompilations,
    outOfBand: edition.friend.outOfBand,
    editionType: edition.type,
    asciidocFiles: [],
    paperbackSplits: edition.paperbackSplits ?? [],
    blurb: edition.document.description,
    config: {},
    customCode: { css: {}, html: {} },
    meta: {
      title: edition.document.title,
      originalTitle: edition.document.originalTitle ?? undefined,
      published: edition.document.published ?? undefined,
      isbn: edition.isbn ?? ``,
      editor: edition.editor ?? undefined,
      author: {
        name: edition.friend.name,
        nameSort: edition.friend.alphabeticalName,
      },
    },
    revision: { timestamp: Date.now(), sha: ``, url: `` },
  };
}
