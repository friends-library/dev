import invariant from 'tiny-invariant';
import { LANG } from '../env';
import { prisma } from './prisma';

export type CustomCode = { css?: string; html?: string };
type FriendSlug = string;
type DocSlug = string;
type FriendDocCombination = string;

let codePromise: Promise<Record<FriendDocCombination, CustomCode>> | null = null;
let friendDocumentsPromise: Promise<Record<FriendSlug, DocSlug[]>> | null = null;

export default function getAllCustomCode(): Promise<
  Record<FriendDocCombination, CustomCode>
> {
  if (codePromise) {
    return codePromise;
  }
  codePromise = getFriendDocuments().then(getGithubCode);
  return codePromise;
}

function getGithubCode(
  friendDocuments: Record<FriendSlug, DocSlug[]>,
): Promise<Record<FriendDocCombination, CustomCode>> {
  const urls = Object.keys(friendDocuments).flatMap((friendSlug) => {
    const documentSlugs = friendDocuments[friendSlug];
    invariant(documentSlugs);
    return documentSlugs.map((docSlug) => `${friendSlug}/${docSlug}`);
  });
  return Promise.all(
    urls.map((url) => {
      const [friendSlug, documentSlug] = url.split(`/`);
      invariant(friendSlug);
      invariant(documentSlug);
      return Promise.all([
        getCode(friendSlug, documentSlug, `css`),
        getCode(friendSlug, documentSlug, `html`),
      ]).then(([css, html]) => ({ url, css, html }));
    }),
  ).then((code) =>
    code.reduce(
      (acc, obj) => ({ ...acc, [obj.url]: { css: obj.css, html: obj.html } }),
      {},
    ),
  );
}

async function getCode(
  friendSlug: string,
  documentSlug: string,
  type: 'css' | 'html',
): Promise<string | undefined> {
  return undefined;
  // const res = await fetch(
  //   `https://raw.githubusercontent.com/${
  //     LANG === `en` ? `friends-library` : `biblioteca-de-los-amigos`
  //   }/${friendSlug}/master/${documentSlug}/paperback-cover.${type}`,
  // );
  // if (res.status === 404) {
  //   return undefined;
  // }
  // return res.text();
}

async function getFriendDocuments(): Promise<Record<FriendSlug, DocSlug[]>> {
  if (friendDocumentsPromise) {
    return friendDocumentsPromise;
  }
  friendDocumentsPromise = _getFriendDocuments();
  return friendDocumentsPromise;
}

async function _getFriendDocuments(): Promise<Record<FriendSlug, DocSlug[]>> {
  const friends = await prisma.friends.findMany({
    where: {
      lang: LANG,
    },
    select: {
      slug: true,
      documents: {
        where: {
          editions: {
            some: {
              is_draft: false,
            },
          },
        },
        select: {
          slug: true,
        },
      },
    },
  });
  return friends.reduce<Record<string, string[]>>((acc, friend) => {
    acc[friend.slug] = friend.documents.map((doc) => doc.slug);
    return acc;
  }, {});
}
