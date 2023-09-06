import { inflect } from './utils';

export function friendPageDescription(
  name: string,
  documents: Array<{ title: string; hasAudio: boolean }>,
  description: string,
): string {
  const hasAudiobooks = documents.some((doc) => doc.hasAudio);

  return `Free ${inflect(`ebook`, documents.length)}${
    hasAudiobooks ? inflect(` and audiobook`, documents.length) : ``
  } by early Quaker writer ${name}: “${documents
    .map((doc) => `${doc.title}`)
    .join(`,” “`)}.” Download as MOBI, EPUB, PDF, ${
    hasAudiobooks ? `listen to a Podcast, MP3s, M4B, ` : ``
  }or order a low-cost paperback. ${description}`;
}

export function documentPageDescription(
  title: string,
  author: string,
  hasAudio: boolean,
  blurb: string,
): string {
  return `Free complete ebook ${hasAudio ? `and audiobook ` : ``}of “${title}”${
    author === `Compilations`
      ? `—a compilation written by early members`
      : ` by ${author}, an early member`
  } of the Religious Society of Friends (Quakers). Download as MOBI, EPUB, PDF,${
    hasAudio ? ` listen to a Podcast, MP3s, M4B,` : ``
  } or order a low-cost paperback. ${blurb}`;
}
