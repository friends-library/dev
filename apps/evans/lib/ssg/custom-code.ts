import pLimit from 'p-limit';
import { LANG } from '../env';
import api from '@/lib/ssg/api-client';

export type CustomCode = { customCss?: string; customHtml?: string };
export type WithCustomCode<T> = T & CustomCode;
export type CustomCodeMap = Record<`${string}/${string}`, CustomCode>;

export async function all(): Promise<CustomCodeMap> {
  return some(await api.publishedDocumentSlugs(LANG));
}

export async function some(
  slugs: Array<{ friendSlug: string; documentSlug: string }>,
): Promise<CustomCodeMap> {
  const fetchAll = await Promise.all(
    slugs.map(({ friendSlug, documentSlug }) =>
      document(friendSlug, documentSlug).then((code) => ({
        key: `${friendSlug}/${documentSlug}` as const,
        ...code,
      })),
    ),
  );
  return fetchAll.reduce<CustomCodeMap>((acc, { key, ...customCode }) => {
    acc[key] = merge({}, customCode);
    return acc;
  }, {});
}

export function document(friendSlug: string, documentSlug: string): Promise<CustomCode> {
  const key = `${friendSlug}/${documentSlug}` as const;
  let promise = _cache.get(key);
  if (!promise) {
    promise = Promise.all([
      limit(() => fetchCode(friendSlug, documentSlug, `css`)),
      limit(() => fetchCode(friendSlug, documentSlug, `html`)),
    ]).then(([customCss, customHtml]) => ({ customCss, customHtml }));
    _cache.set(key, promise);
  }
  return promise;
}

export function merge<T>(obj: T, customCode: CustomCode): WithCustomCode<T> {
  const merged = { ...obj, ...customCode };
  // nextjs won't serialize `undefined` props
  if (!merged.customCss) {
    delete merged.customCss;
  }
  if (!merged.customHtml) {
    delete merged.customHtml;
  }
  return merged;
}

export function merging<T>(
  code: CustomCodeMap,
  slugs: (obj: T) => [friendSlug: string, documentSlug: string],
): (obj: T) => WithCustomCode<T> {
  return (obj: T) => {
    const [friendSlug, documentSlug] = slugs(obj);
    const coverCode = code[`${friendSlug}/${documentSlug}`];
    return merge(obj, coverCode ?? {});
  };
}

export function documentSlugs(input: { friendSlug: string; slug: string }): {
  friendSlug: string;
  documentSlug: string;
} {
  return { friendSlug: input.friendSlug, documentSlug: input.slug };
}

// helpers

const _cache: Map<`${string}/${string}`, Promise<CustomCode>> = new Map();

async function fetchCode(
  friendSlug: string,
  documentSlug: string,
  type: `css` | `html`,
): Promise<string | undefined> {
  const url = [
    `https://raw.githubusercontent.com`,
    LANG === `en` ? `friends-library` : `biblioteca-de-los-amigos`,
    friendSlug,
    `master`,
    documentSlug,
    `paperback-cover.${type}`,
  ].join(`/`);
  try {
    const res = await fetch(url);
    if (res.status === 404) {
      return undefined;
    }
    return res.text();
  } catch (error) {
    process.stderr.write(`Unexpected error fetching custom code \`${url}\`\n`);
    console.error(error); // eslint-disable-line no-console
    process.exit(1);
  }
}

function getConcurrencyLimit(): number {
  const explicitLimit = process.env.FETCH_CUSTOM_CODE_CONCURRENCY;
  if (explicitLimit && !isNaN(Number(explicitLimit))) {
    return Number(explicitLimit);
  }
  if (process.env.VERCEL || process.env.GITHUB_ACTIONS) {
    return 50;
  }
  return 100;
}

const limit = pLimit(getConcurrencyLimit());
