import { t } from '@friends-library/locale';
import type { Lang } from '@friends-library/types';
import type { Audiobook, DocumentWithMeta, NewsFeedType } from '@/lib/types';
import { months } from '@/lib/dates';
import { LANG } from '@/lib/env';
import { htmlShortTitle } from '@friends-library/adoc-utils';
import { isNotNull } from '@/lib/utils';
import { getDocumentUrl } from '@/lib/friend';

export interface FeedItem {
  month: string;
  day: string;
  year: string;
  type: NewsFeedType;
  title: string;
  description: string;
  url: string;
  date: string;
}

type NewsfeedDocumentProps = Pick<
  DocumentWithMeta,
  | 'authorName'
  | 'dateAdded'
  | 'id'
  | 'title'
  | 'authorSlug'
  | 'slug'
  | 'editions'
  | 'mostModernEdition'
  | 'altLanguageId'
>;

export async function getNewsFeedItems(
  lang: Lang,
  documents: {
    en: Array<NewsfeedDocumentProps>;
    es: Array<NewsfeedDocumentProps>;
  },
): Promise<FeedItem[]> {
  const outOfBandEvents = getOutOfBandEvents();
  const recentAdditions = getRecentAdditions(`es`, documents.es, documents.en).concat(
    LANG === `en` ? getRecentAdditions(`en`, documents.en) : [],
  );
  const recentAudios = getRecentAudios(documents[lang]);
  return recentAdditions
    .concat(outOfBandEvents.filter((item) => item.lang.includes(lang)))
    .concat(recentAudios)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, MAX_NUM_NEWS_FEED_ITEMS);
}

function getRecentAdditions(
  lang: Lang,
  documents: Array<NewsfeedDocumentProps>,
  altLanguageDocuments: Array<NewsfeedDocumentProps> = [],
): FeedItem[] {
  const type = LANG === `en` && lang === 'es' ? `spanish_translation` : `book`;
  return documents
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .map((doc) => {
      return {
        type,
        title:
          lang === `en`
            ? htmlShortTitle(doc.title)
            : `${htmlShortTitle(doc.title)}${LANG === `en` ? ` &mdash; (Spanish)` : ``}`,
        ...dateFields(doc.mostModernEdition.impressionCreatedAt, LANG),
        description:
          type === 'book'
            ? LANG === `en`
              ? `Download free eBook or pdf, or purchase a paperback at cost.`
              : `Descárgalo en formato ebook o pdf, o compra el libro impreso a precio de costo.`
            : `${doc.authorName}'s <em>${
                altLanguageDocuments.find((altDoc) => altDoc.altLanguageId === doc.id)
                  ?.title ?? ``
              }</em> is now translated and available on the Spanish site.`,
        url:
          type === `spanish_translation`
            ? `https://bibliotecadelosamigos.org/${doc.authorSlug}/${doc.slug}`
            : `/${doc.authorSlug}/${doc.slug}`,
      };
    });
}

function getRecentAudios(
  documents: Array<
    Pick<
      DocumentWithMeta,
      'authorName' | 'dateAdded' | 'id' | 'title' | 'authorSlug' | 'slug' | 'editions'
    >
  >,
): FeedItem[] {
  return documents
    .map((doc) =>
      doc.editions.reduce<(Audiobook & { title: string; url: string }) | null>(
        (acc, ed) => {
          if (
            ed.audiobook &&
            new Date(ed.audiobook.dateAdded).getTime() >
              new Date(acc ? acc.dateAdded : 'January 1, 1970').getTime()
          ) {
            ed.audiobook;
            return {
              ...ed.audiobook,
              title: htmlShortTitle(doc.title),
              url: `${getDocumentUrl(doc.authorSlug, doc.slug)}#audiobook`,
            };
          }
          return acc;
        },
        null,
      ),
    )
    .filter(isNotNull)
    .map((audio) => ({
      type: `audiobook`,
      title: `${audio.title} &mdash; (${LANG === `en` ? `Audiobook` : `Audiolibro`})`,
      ...dateFields(audio.dateAdded, LANG),
      description:
        LANG === `en`
          ? `Free audiobook is now available for download or listening online.`
          : `El audiolibro ya está disponible para descargar gratuitamente o escuchar en línea.`,
      url: audio.url,
    }));
}

function dateFields(
  dateStr: string,
  lang: Lang,
): Pick<FeedItem, 'month' | 'year' | 'day' | 'date'> {
  const date = new Date(dateStr);
  let month = months[lang][date.getMonth()]?.substring(0, 3) || ``;

  return {
    month,
    year: String(date.getFullYear()),
    day: String(date.getDate()),
    date: dateStr,
  };
}

function getOutOfBandEvents(): (FeedItem & { lang: Lang[] })[] {
  return [
    {
      lang: [`en`],
      type: `spanish_translation`,
      title: `Sewel’s History Spanish Translation Completed`,
      description: `The twenty-fourth and final chapter has been translated, and after 300 years, the entire book is now available in Spanish for the first time ever.`,
      ...dateFields(`2023-05-22T16:08:05.231Z`, `es`),
      url: `https://www.bibliotecadelosamigos.org/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `La Historia de los Cuáqueros - (El Último Capítulo)`,
      description: `El vigésimo cuarto y <em>ÚLTIMO</em> capítulo de La Historia de los Cuáqueros ya está terminado, y después de 300 años, el libro entero está disponible por primera vez en español.`,
      ...dateFields(`2023-05-22T16:08:05.231Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 23)`,
      description: `El vigésimo tercer capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2023-05-02T19:53:09.155Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 22)`,
      description: `El vigésimo segundo capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2023-03-20T17:27:01.831Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 21)`,
      description: `El vigésimo primer capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2023-02-21T15:59:06.506Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 20)`,
      description: `El vigésimo capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2022-12-08T12:29:08.384Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 19)`,
      description: `El decimonoveno capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2022-09-30T14:17:45.367Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 18)`,
      description: `El decimoctavo capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2022-09-06T20:25:34.201Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`en`],
      type: `book`,
      title: `New modernized and annotated edition of Sewel&rsquo;s classic History of the Quakers`,
      description: `Download free ebook or pdf, or purchase a paperback at cost.`,
      ...dateFields(`2022-08-11T14:52:49.430Z`, `en`),
      url: `/william-sewel/history-of-quakers`,
    },
    {
      lang: [`en`],
      type: `book`,
      title: `Fruits of Retirement &mdash; Poetry of Mary Mollineux`,
      description: `Download free ebook or pdf, or purchase a paperback at cost.`,
      ...dateFields(`2022-07-29T20:06:41.268Z`, `en`),
      url: `/mary-mollineux/fruits-of-retirement`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulos 16 y 17)`,
      description: `Los capítulos dieciséis y diecisiete de la <em>Historia de los Cuáqueros</em> ya están disponibles, y se pueden descargar gratuitamente.`,
      ...dateFields(`2022-07-19T15:01:25.265Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulos 14 y 15)`,
      description: `Los capítulos decimocuarto y decimoquinto de la <em>Historia de los Cuáqueros</em> ya están disponibles, y se pueden descargar gratuitamente.`,
      ...dateFields(`2022-05-09T15:01:59.905Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`en`],
      type: `feature`,
      title: `Search Ebook Text in the Friends Library App`,
      description: `New version released today supports searching ebooks for specific words and phrases.`,
      ...dateFields(`2022-03-24T18:51:50.027Z`, `en`),
      url: `/app`,
    },
    {
      lang: [`es`],
      type: `feature`,
      title: `Buscar un texto específico en nuestra aplicación`,
      description: `Hoy se ha lanzado una nueva versión que permite buscar palabras y frases específicas en los libros.`,
      ...dateFields(`2022-03-24T18:51:50.027Z`, `es`),
      url: `/app`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 13)`,
      description: `El decimotercer capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2022-01-31T18:21:34.548Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Hay un Espíritu que Siento en Mí &mdash; (Apéndice)`,
      description: `El último capítulo de los escritos de James Nayler ha sido traducido. Ya está disponible el libro completo.`,
      ...dateFields(`2022-01-19T15:48:32.765Z`, `es`),
      url: `/james-nayler/escritos`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Hay un Espíritu que Siento en Mí &mdash; (Capítulo 6)`,
      description: `El sexto capítulo de los escritos de James Nayler ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2022-01-18T14:28:31.144Z`, `es`),
      url: `/james-nayler/escritos`,
    },
    {
      lang: [`es`],
      type: `feature`,
      title: `La aplicación de la Biblioteca de los Amigos ahora es compatible con iPads y tabletas`,
      description: `Ya está disponible para descargar gratuitamente en la App Store de Apple o en Google Play para Android`,
      ...dateFields(`2021-10-07T13:30:57.106Z`, `es`),
      url: `/app`,
    },
    {
      lang: [`en`],
      type: `feature`,
      title: `The Friends Library App now supports iPads and tablets`,
      description: `Available now for free download in the Apple App Store or on Google Play for Android`,
      ...dateFields(`2021-10-07T13:30:57.106Z`, `en`),
      url: `/app`,
    },
    {
      lang: [`en`],
      type: `book`,
      title: `The Unabridged Works of Isaac Penington, Vol. I — IV`,
      description: `Download free ebooks or pdfs, or purchase paperbacks at cost.`,
      ...dateFields(`2021-09-16T17:34:19.765Z`, `en`),
      url: `/friend/isaac-penington`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Hay un Espíritu que Siento en Mí &mdash; (Capítulo 5)`,
      description: `El quinto capítulo de los escritos de James Nayler ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2021-09-08T14:16:25.848Z`, `es`),
      url: `/james-nayler/escritos`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 12)`,
      description: `El duodécimo capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2021-09-01T20:14:16.475Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 11)`,
      description: `El undécimo capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2021-07-27T20:06:46.210Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 10)`,
      description: `El décimo capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2021-07-12T16:30:31.888Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Hay un Espíritu que Siento en Mí &mdash; (Capítulo 4)`,
      description: `El cuarto capítulo de los escritos de James Nayler ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2021-07-08T23:41:33.208Z`, `es`),
      url: `/james-nayler/escritos`,
    },
    {
      lang: [`en`],
      type: `feature`,
      title: `Friends Library App version 2.0 Released`,
      description: `The new version allows you to <em>read</em> any of our published books, right within the app.`,
      ...dateFields(`2021-06-28T16:43:48.053Z`, `en`),
      url: `/app`,
    },
    {
      lang: [`es`],
      type: `feature`,
      title: `¡Hemos lanzado la versión 2.0 de la Aplicación de la Biblioteca de los Amigos!`,
      description: `En la nueva versión los libros que tenemos publicados se pueden <em>leer</em> directamente en la aplicación.`,
      ...dateFields(`2021-06-28T16:43:48.053Z`, `es`),
      url: `/app`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 9)`,
      description: `El noveno capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2021-04-06T14:54:20.039Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `feature`,
      title: `Ya Puedes Descargar los Libros como Texto Sin Formato`,
      description: `Ahora todos los libros están disponibles para descargarlos como un texto sin formato, ideal para la aplicaciones que convierten el texto a voz como “Voice Dream.”`,
      ...dateFields(`2021-04-05T16:32:48.168Z`, `es`),
      url: t`/plain-text-format`,
    },
    {
      lang: [`en`],
      type: `feature`,
      title: `New Plain Text Download Format`,
      description: `All books now available in a plain-text download format, ideal for text-to-speech apps like “Voice Dream.”`,
      ...dateFields(`2021-04-05T16:32:48.168Z`, `en`),
      url: t`/plain-text-format`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Hay un Espíritu que Siento en Mí &mdash; (Capítulo 3)`,
      description: `El tercer capítulo de los escritos de James Nayler ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2021-03-15T16:25:41.152Z`, `es`),
      url: `/james-nayler/escritos`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 8)`,
      description: `El octavo capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2021-03-12T19:11:41.166Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 7)`,
      description: `El séptimo capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2021-02-15T15:45:03.060Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Hay un Espíritu que Siento en Mí &mdash; (Capítulo 2)`,
      description: `El segundo capítulo de los escritos de James Nayler ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2021-01-26T21:37:10.112Z`, `es`),
      url: `/james-nayler/escritos`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 6)`,
      description: `El sexto capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2021-01-18T16:51:46.376Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Hay un Espíritu que Siento en Mí &mdash; (Capítulo 1)`,
      description: `El primer capítulo de los escritos de James Nayler ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2020-12-04T19:17:21.951Z`, `es`),
      url: `/james-nayler/escritos`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 5)`,
      description: `El quinto capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2020-12-04T19:15:21.951Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`en`],
      type: `feature`,
      title: `Friends Library App Released`,
      description: `Friends Library App for iOS and Android now available!`,
      ...dateFields(`2020-11-12T16:27:48.609Z`, `en`),
      url: `/app`,
    },
    {
      lang: [`es`],
      type: `feature`,
      title: `Nueva Aplicación para la Biblioteca de los Amigos`,
      description: `¡Ya se encuentra disponible la Aplicación para dispositivos iOS y Android!`,
      ...dateFields(`2020-11-12T16:27:48.609Z`, `es`),
      url: `/app`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 4)`,
      description: `El cuarto capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2020-10-04T19:15:21.951Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 3)`,
      description: `El tercer capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2020-08-27T22:15:32.822Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 2)`,
      description: `El segundo capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2020-07-14T12:00:01.000Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Capítulo 1)`,
      description: `El primer capítulo de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2020-06-12T12:00:00.000Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
    {
      lang: [`es`],
      type: `chapter`,
      title: `Historia de los Cuáqueros &mdash; (Prefacio)`,
      description: `El prefacio de la <em>Historia de los Cuáqueros</em> ya está disponible y se puede descargar gratuitamente.`,
      ...dateFields(`2020-06-12T12:00:00.000Z`, `es`),
      url: `/william-sewel/historia-de-los-cuaqueros`,
    },
  ];
}

export const COLOR_MAP: { [k in NewsFeedType]: string } = {
  book: `flblue`,
  spanish_translation: LANG === `en` ? `flgold` : `flmaroon`,
  feature: `flgreen`,
  chapter: `flgold`,
  audiobook: `flmaroon`,
};

const MAX_NUM_NEWS_FEED_ITEMS = 24;
