import moment from 'moment';
import pickBy from 'lodash.pickby';
import { HTML_DEC_ENTITIES } from '@friends-library/types';
import { htmlTitle } from '@friends-library/adoc-utils';
import { t, setLocale } from '@friends-library/locale';
import type { FileManifest } from '@friends-library/doc-artifacts';
import type { HtmlSrcResult } from '@friends-library/evaluator';
import type { DocPrecursor } from '@friends-library/types';
import { capitalizeTitle, ucfirst } from './utils';
import { addVolumeSuffix } from './faux-volumes';

export function frontmatter(dpc: DocPrecursor, src: HtmlSrcResult): FileManifest {
  const files = {
    'half-title': halfTitle(dpc),
    'original-title': originalTitle(dpc),
    copyright: copyright(dpc),
    epigraph: src.epigraphHtml,
  };
  return pickBy(files, (html) => html !== ``);
}

export function halfTitle(dpc: DocPrecursor, volIdx?: number): string {
  const {
    lang,
    meta: {
      title,
      editor,
      author: { name },
    },
  } = dpc;

  const prettyTitle = htmlTitle(addVolumeSuffix(title, volIdx)).replace(
    name,
    name.replace(/ /g, HTML_DEC_ENTITIES.NON_BREAKING_SPACE),
  );

  let markup = `<h1>${prettyTitle}</h1>`;

  if (name === `Gerhard Tersteegen`) {
    markup = `${markup}\n<p class="byline">Editado por Samuel Jackson</p>`;
    return markup;
  }

  const nameInTitle = title.indexOf(name) !== -1;
  if (!nameInTitle && !dpc.isCompilation) {
    markup = `${markup}\n<p class="byline">${lang === `en` ? `by` : `por`} ${name}</p>`;
  }

  if (editor && lang === `en`) {
    markup += `\n<p class="editor">Edited by ${editor}</p>`;
  }

  return markup;
}

export function originalTitle({ meta, lang }: DocPrecursor): string {
  if (!meta.originalTitle) {
    return ``;
  }

  setLocale(lang);
  return `
    <div class="original-title-page">
      <p class="originally-titled__label">
        ${t`Original title`}:
      </p>
      <p class="originally-titled__title">
        ${capitalizeTitle(meta.originalTitle, lang)}
      </p>
    </div>
  `;
}

export function copyright(dpc: DocPrecursor): string {
  const {
    lang,
    revision: { timestamp, sha, url },
    meta: { published, isbn },
  } = dpc;
  setLocale(lang);
  moment.locale(lang);

  let time = moment
    .utc(moment.unix(timestamp))
    .format(lang === `en` ? `MMMM Do, YYYY` : `D [de] MMMM, YYYY`);

  if (lang === `es`) {
    time = time
      .split(` `)
      .map((p) => (p === `de` ? p : ucfirst(p)))
      .join(` `);
  }

  const webUrl = `https://www.${t`friendslibrary.com`}`;
  const email = t`info@friendslibrary.com`;

  return `
  <div class="copyright-page">
    <ul>
      <li>${t`Public domain in the USA`}</li>
      ${published ? `<li>${t`Originally published in ${published}`}</li>` : ``}
      ${isbn ? `<li id="isbn">ISBN: <code>${isbn}</code></li>` : ``}
      <li>${t`Text revision ${`<code><a href="${url}">${sha}</a></code> — ${time}`}`}</li>
      <li>${t`Created and freely distributed by`} <a href="${webUrl}">${t`Friends Library Publishing`}</a></li>
      <li>${t`Find more free books from early Quakers at`} <a href="${webUrl}">${t`friendslibrary.com`}</a></li>
      <li>${t`Contact the publishers at`} <a href="mailto:${email}">${email}</a></li>
    </ul>
  </div>
  `;
}
