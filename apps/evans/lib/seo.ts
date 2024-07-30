import { type Metadata } from 'next';
import { t } from '@friends-library/locale';
import { LANG } from './env';

export function data(
  title: string,
  description: string,
  ogImage?: string,
  lang = LANG,
): { title: string; description: string; ogImage: string } {
  return {
    title: title === t`Friends Library` ? title : `${title} | ${t`Friends Library`}`,
    description,
    ogImage:
      ogImage ??
      `https://raw.githubusercontent.com/friends-library/dev/f487c5bae17501abb91d8f18323391075577ff9b/apps/native/release-assets/android/${lang}/phone/feature.png`,
  };
}

export function nextMetadata(
  title: string,
  description: string,
  ogImage?: string,
  lang = LANG,
): Metadata {
  const d = data(title, description, ogImage, lang);
  return {
    title: d.title,
    description: d.description,
    openGraph: {
      title: d.title,
      description: d.description,
      images: [{ url: d.ogImage }],
    },
  };
}

export function bookPageMetaDesc(
  name: string,
  description: string,
  title: string,
  hasAudio: boolean,
  isCompilation: boolean,
  lang = LANG,
): string {
  const comp = isCompilation;
  const EN = lang === `en`;
  const ES = lang === `es`;
  title = `“${title}”`;
  return [
    EN ? `Free complete ebook` : `Obtén de forma gratuita el libro electrónico completo`,
    EN && hasAudio ? `and audiobook` : false,
    ES && hasAudio ? `y el audiolibro` : false,
    EN && !comp ? `of ${title} by ${name}, an early member` : false,
    ES && !comp ? `de ${title} escrito por ${name},` : false,
    EN && comp ? `of ${title}—a compilation written by early members` : false,
    ES && comp
      ? `de ${title}—una compilación escrita por los primeros miembros de la Sociedad de Amigos (Cuáqueros).`
      : false,
    EN ? `of the Religious Society of Friends (Quakers).` : false,
    ES && !comp ? `un antiguo miembro de la Sociedad de Amigos (Cuáqueros).` : false,
    EN ? `Download and read ${hasAudio ? `or listen ` : ``}for free,` : false,
    ES && hasAudio ? `Descargar y leer o escuchar de forma gratuita,` : false,
    ES && !hasAudio ? `Descargar y leer gratis,` : false,
    EN
      ? `or order a low-cost paperback.`
      : `o pedir un libro impreso por un precio muy económico.`,
    description,
  ]
    .filter(Boolean)
    .join(` `)
    .replace(/&#8212;/g, `—`)
    .replace(/&#160;/g, ` `);
}

export function friendPageMetaDesc(
  name: string,
  description: string,
  titles: string[],
  numAudioBooks: number,
  isCompilations: boolean,
  lang = LANG,
): string {
  const quotedTitles = titles.map((t) => `“${t}”`);
  const comp = isCompilations;
  const EN = lang === `en`;
  const ES = lang === `es`;
  const plural = quotedTitles.length > 1;
  const s = plural ? `s` : ``;
  const lastTitle = quotedTitles[quotedTitles.length - 1];
  const hasAudio = numAudioBooks > 0;
  return [
    EN ? `Free ebook${s}` : `Libro${s} electrónico${s}`,
    EN && numAudioBooks ? `and audiobook${numAudioBooks > 1 ? `s` : ``}` : false,
    ES && numAudioBooks ? `y audiolibro${numAudioBooks > 1 ? `s` : ``}` : false,
    EN && !comp ? `by early Quaker writer ${name}:` : false,
    ES && !comp ? `gratuito${s}, escrito${s} por ${name},` : false,
    ES && !comp ? `uno de los antiguos Cuáqueros:` : false,
    EN && comp ? `of` : false,
    ES && comp ? `gratuitos de` : false,
    quotedTitles.length < 3 ? quotedTitles.join(EN ? ` and ` : ` y `) : false,
    quotedTitles.length > 2 ? quotedTitles.slice(0, 2).join(`, `) + `,` : false,
    quotedTitles.length > 2 ? `${EN ? `and` : `y`} ${lastTitle}` : false,
    !comp ? `<.` : false,
    EN && comp ? `—${plural ? `compilations` : `a compilation`}` : false,
    EN && comp
      ? `written by early members of the Religious Society of Friends (Quakers).`
      : false,
    ES && comp
      ? `—${plural ? `compilaciones escritas` : `una compilación escrita`}`
      : false,
    ES && comp
      ? `por los primeros miembros de la Sociedad de Amigos (Cuáqueros).`
      : false,
    EN ? `Download and read ${hasAudio ? `or listen ` : ``}for free,` : false,
    ES && hasAudio ? `Descargar y leer o escuchar de forma gratuita,` : false,
    ES && !hasAudio ? `Descargar y leer gratis,` : false,
    EN
      ? `or order a low-cost paperback.`
      : `o pedir un libro impreso por un precio muy económico.`,
    description,
  ]
    .filter(Boolean)
    .join(` `)
    .replace(/&#8212;/g, `—`)
    .replace(/&#160;/g, ` `)
    .replace(/ <\./g, `.`)
    .replace(/” —/g, `”—`)
    .replace(/”(\.|,)/g, `$1”`);
}

export function pageMetaDesc(
  page: keyof typeof PAGE_META_DESCS,
  replacing: { [K in keyof typeof replacements]?: number },
): string {
  let desc = PAGE_META_DESCS[page];
  for (const [key, value] of Object.entries(replacing)) {
    const pattern = replacements[key as keyof typeof replacements];
    desc = desc.replace(pattern, String(value));
  }
  return desc;
}

const replacements = {
  numAudiobooks: /%NUM_AUDIOBOOKS%/g,
  numBooks: /%NUM_BOOKS%/g,
  numUpdatedEditions: /%NUM_UPDATED_EDITIONS%/g,
  numFriends: /%NUM_FRIENDS%/g,
};

const PAGE_META_DESCS = {
  home:
    LANG === `en`
      ? `Friends Library exists to freely share the writings of early members of the Religious Society of Friends (Quakers), believing that no other collection of Christian writings more accurately communicates or powerfully illustrates the soul-transforming power of the gospel of Jesus Christ. We have %NUM_BOOKS% books available for free download in multiple editions and digital formats, and a growing number of them are also recorded as audiobooks. Paperback copies are also available at very low cost.`
      : `La Biblioteca de los Amigos ha sido creada para compartir gratuitamente los escritos de los primeros miembros de la Sociedad de Amigos (Cuáqueros), ya que creemos que no existe ninguna otra colección de escritos cristianos que comunique con mayor precisión, o que ilustre con más pureza, el poder del evangelio de Jesucristo que transforma el alma. Actualmente tenemos %NUM_BOOKS% libros disponibles para descargarse gratuitamente en múltiples ediciones y formatos digitales, y un número creciente de estos libros están siendo grabados como audiolibros. Libros impresos también están disponibles por un precio muy económico.`,
  audiobooks:
    LANG === `en`
      ? `Browse %NUM_AUDIOBOOKS% free audiobooks from early members of the Religious Society of Friends (Quakers). Listen in our Android/iOS app, download as a podcast, MP3s, or an M4B file, or listen online from your browser. All books are also available to download and read for free in our app, as an ebook or PDF, or paperback copies are available at very low cost.`
      : `Dale un vistazo a nuestros audiolibros gratuitos de los primeros miembros de la Sociedad Religiosa de Amigos (Cuáqueros). Puedes escuchar los audios en nuestra aplicación para Android y iOS, descargar el audio como un podcast, MP3, o un archivo M4B, o reproducirlo en línea desde tu navegador. También, los libros completos están disponibles para ser descargados gratuitamente en formatos digitales como EPUB o PDF. Libros impresos también están disponibles por un precio muy económico.`,
  contact:
    LANG === `en`
      ? `Got a question? — or are you having any sort of technical trouble with our books or website? Want to reach out for any other reason? We’d love to hear from you! You can expect to hear back within a day or two.`
      : `¿Tienes alguna pregunta? — ¿o estás teniendo algún tipo de problema técnico con nuestros libros o con el sitio? ¿Quieres ponerte en contacto por alguna otra razón? ¡Nos encantaría escucharte! Puedes contar con nuestra respuesta en un día o dos.`,
  explore:
    LANG === `en`
      ? `Explore %NUM_BOOKS% books written by early members of the Religious Society of Friends (Quakers) – available to download and read or listen for free. Browse %NUM_UPDATED_EDITIONS% updated editions, %NUM_AUDIOBOOKS% audiobooks, and recently added titles, or view books by geographic region or time period.`
      : `Explora nuestros %NUM_BOOKS% libros escritos por los primeros miembros de la Sociedad de Amigos (Cuáqueros), disponibles de forma gratuita en formatos digitales EPUB, PDF, y audiolibros. Puedes navegar por todos nuestros libros y audiolibros, o buscar libros en la categoría particular que más te interese.`,
  app:
    LANG === `en`
      ? `The Friends Library Android and iOS (iPhone and iPad) apps allow users to freely and easily download and listen to all of the audiobooks available from this site. All audiobooks were written by early members of the Religious Society of Friends (Quakers).`
      : `La aplicación de la Biblioteca de los Amigos (disponible en iOS para Iphone y Ipad, y en Android), les permite a los usuarios descargar y escuchar de forma gratuita y sencilla todos los audiolibros de nuestro sitio. Todos estos audiolibros han sido escritos por los primeros miembros de la Sociedad Religiosa de Amigos (Cuáqueros)`,
  friends:
    LANG === `en`
      ? `Friends Library currently contains books written by %NUM_FRIENDS% early members of the Religious Society of Friends (Quakers), and more authors are being added regularly. View all authors here, including William Penn, Isaac Penington, Robert Barclay, and George Fox. All books are freely available in their entirety in our Android/iOS app or to download as an ebook or PDF, and a growing number are also available as free audiobooks. Paperback copies are also available at very low cost.`
      : `Actualmente la Biblioteca de Amigos contiene libros escritos por 114 miembros de la primitiva Sociedad Religiosa de los Amigos (Cuáqueros), y constantemente estamos añadiendo nuevos autores. Aquí puedes ver todos nuestros autores, incluyendo William Penn, Isaac Penington, Robert Barclay, y George Fox. Todos los libros pueden ser leídos gratuitamente en nuestra aplicación para Android y iOS, o descargados a tu dispositivo como eBook o PDF, y muchos han sido grabados como audiolibros. Libros impresos también están disponibles por un precio muy económico.`,
  'getting-started':
    LANG === `en`
      ? `View hand-picked reading recommendations to help you get started with our %NUM_BOOKS% books written by early members of the Religious Society of Friends (Quakers). Recommendations come in four categories: History, Doctrine, Spiritual Life, and Journals. All books are freely available in their entirety in our Android/iOS app or to download as an ebook or PDF, and a growing number are also available as free audiobooks. Paperback copies are also available at very low cost.`
      : `Hemos seleccionado algunos de nuestros libros favoritos de los primeros miembros de la Sociedad de Amigos (Cuáqueros), y los hemos organizado en categorías para ayudarte a comenzar. Nuestras recomendaciones están organizadas en cuatro categorías: Historia, Doctrina, Vida Espiritual, y Biografía. Todos los libros pueden ser leídos gratuitamente en nuestra aplicación para Android y iOS, o descargados a tu dispositivo como eBook o PDF, y muchos han sido grabados como audiolibros. Libros impresos también están disponibles por un precio muy económico.`,
};
