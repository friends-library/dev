import fs from 'node:fs';
import path from 'node:path';
import { encode } from 'he';
import { LANG, APP_URL } from '../env';
import { type Api } from './api-client';

interface Podcast {
  title: string;
  imageUrl: string;
  loggedDownloadUrl: string;
  sourcePath: string;
  description: string;
  friendName: string;
  isCompilation: boolean;
  reader: string;
  episodes: Array<{
    title: string;
    loggedDownloadUrl: string;
    sizeInBytes: number;
    createdAt: ISODateString;
    durationInSeconds: number;
  }>;
}

export function generatePodcastFeeds(
  document: Api.DocumentPage.Output[`document`],
): void {
  const audiobook = document.primaryEdition.audiobook;
  if (!audiobook) {
    return;
  }
  for (const quality of [`hq`, `lq`] as const) {
    const filepath = `./public/${audiobook.sourcePath[quality]}`;
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(
      filepath,
      podcastXml({
        title: document.title,
        imageUrl: audiobook.podcastImageUrl,
        loggedDownloadUrl: audiobook.podcastLoggedDownloadUrl.hq,
        sourcePath: audiobook.sourcePath[quality],
        description: document.description,
        friendName: document.friendName,
        isCompilation: document.isCompilation,
        reader: audiobook.reader,
        episodes: audiobook.parts.map((part) => ({
          title: part.title,
          loggedDownloadUrl: part.loggedDownloadUrl[quality],
          sizeInBytes: part.sizeInBytes[quality],
          durationInSeconds: part.durationInSeconds,
          createdAt: part.createdAt,
        })),
      }),
    );
  }
}

export function podcastXml(podcast: Podcast): string {
  const launchDate = new Date(`2020-03-27T12:00:00.000Z`);
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:atom="http://www.w3.org/2005/Atom"
  version="2.0"
>
  <channel>
    <atom:link
      href="${podcast.loggedDownloadUrl}"
      rel="self"
      type="application/rss+xml"
    />
    <title>${encode(podcast.title)}</title>
    <itunes:subtitle>${subtitle(podcast)}</itunes:subtitle>
    <link>${podcast.loggedDownloadUrl}</link>
    <language>${LANG}</language>
    <itunes:author>${encode(podcast.friendName)}</itunes:author>
    <description>${encode(podcast.description)}</description>
    <itunes:summary>${encode(podcast.description)}</itunes:summary>
    <itunes:explicit>clean</itunes:explicit>
    <itunes:type>episodic</itunes:type>
    <itunes:complete>Yes</itunes:complete>
    <itunes:owner>
      <itunes:name>Jared Henderson</itunes:name>
      <itunes:email>jared.thomas.henderson@gmail.com</itunes:email>
    </itunes:owner>
    <itunes:image href="${podcast.imageUrl}" />
    <image>
      <url>${podcast.imageUrl}</url>
      <title>${encode(podcast.title)}</title>
      <link>${podcast.loggedDownloadUrl}</link>
    </image>
    <itunes:category text="Religion &amp; Spirituality">
      <itunes:category text="Christianity" />
    </itunes:category>
    ${podcast.episodes
      .map((episode, index) => {
        const num = index + 1;
        const desc = episodeDescription(
          podcast,
          episode.title,
          num,
          podcast.episodes.length,
        );
        const createdAt = new Date(episode.createdAt);
        return `<item>
      <title>${episodeTitle(podcast.title, num, podcast.episodes.length)}</title>
      <enclosure
        url="${episode.loggedDownloadUrl}"
        length="${episode.sizeInBytes}"
        type="audio/mpeg"
      />
      <itunes:author>${encode(podcast.friendName)}</itunes:author>
      <itunes:summary>${desc}</itunes:summary>
      <itunes:subtitle>${desc}</itunes:subtitle>
      <description>${desc}</description>
      <guid isPermaLink="false">${podcast.sourcePath} pt-${num} at ${APP_URL}</guid>
      <pubDate>${(createdAt.getTime() < launchDate.getTime()
        ? launchDate
        : createdAt
      ).toUTCString()}</pubDate>
      <itunes:duration>${episode.durationInSeconds}</itunes:duration>
      <itunes:order>${num}</itunes:order>
      <itunes:explicit>clean</itunes:explicit>
      <itunes:episodeType>full</itunes:episodeType>
    </item>`;
      })
      .join(`\n    `)}
  </channel>
</rss>
`;
}

export function subtitle(
  podcast: Pick<Podcast, `isCompilation` | `title` | `friendName` | `reader`>,
  lang = LANG,
): string {
  if (lang === `es`) {
    return `Audiolibro de "${podcast.title}"${
      podcast.isCompilation ? `` : ` escrito por ${podcast.friendName}`
    }, de la Biblioteca de los Amigos. Leído por ${podcast.reader}.`;
  }
  return `Audiobook of ${podcast.isCompilation ? `` : `${podcast.friendName}'s `}"${
    podcast.title
  }" from The Friends Library. Read by ${podcast.reader}.`;
}

export function episodeDescription(
  podcast: Pick<Podcast, `title` | `friendName`>,
  partTitle: string,
  partNumber: number,
  numParts: number,
  lang = LANG,
): string {
  const by = lang === `en` ? `by` : `escrito por`;
  const Of = lang === `en` ? `of` : `de`;
  const Part = lang === `en` ? `Part` : `Parte`;
  const byLine = `"${encode(podcast.title)}" ${by} ${encode(podcast.friendName)}`;
  if (numParts === 1) {
    return lang === `en` ? `Audiobook version of ${byLine}` : `Audiolibro de ${byLine}`;
  }

  let desc = [
    `${Part} ${partNumber} ${Of} ${numParts}`,
    lang === `en` ? `of the audiobook version of` : `del audiolibro de`,
    byLine,
  ].join(` `);

  if (partTitle !== `${Part} ${partNumber}`) {
    desc = `${partTitle}. ${desc}`;
  }

  desc = desc.replace(/^Chapter (\d)/, `Ch. $1`);
  desc = desc.replace(/^Capítulo (\d)/, `Cp. $1`);

  return desc;
}

export function episodeTitle(
  podcastTitle: string,
  partNumber: number,
  numParts: number,
): string {
  if (numParts === 1) {
    return podcastTitle;
  }
  return `${podcastTitle}, pt. ${partNumber}`;
}
