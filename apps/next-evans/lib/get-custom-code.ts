import { LANG } from './env';

export default function getCustomCode(
  friendSlug: string,
  documentSlugs: string[],
): Promise<Record<string, { css?: string; html?: string }>> {
  return Promise.all(
    documentSlugs.map((documentSlug) =>
      Promise.all([
        getCode(friendSlug, documentSlug, `css`),
        getCode(friendSlug, documentSlug, `html`),
      ]).then(([css, html]) => ({ css, html, slug: documentSlug })),
    ),
  ).then((codes) =>
    codes.reduce((acc: Record<string, { css?: string; html?: string }>, code) => {
      acc[code.slug] = { css: code.css, html: code.html };
      return acc;
    }, {}),
  );
}

async function getCode(
  friendSlug: string,
  documentSlug: string,
  type: 'css' | 'html',
): Promise<string | undefined> {
  const res = await fetch(
    `https://raw.githubusercontent.com/${
      LANG === `en` ? `friends-library` : `biblioteca-de-los-amigos`
    }/${friendSlug}/master/${documentSlug}/paperback-cover.${type}`,
  );
  if (res.status === 404) {
    return undefined;
  }
  return res.text();
}
