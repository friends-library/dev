import { translate, setLocale } from '@friends-library/locale';
import { utf8ShortTitle } from '@friends-library/adoc-utils';
import type { AudioQuality, Lang } from '@friends-library/types';
import type { SoundCloudTrackAttrs, Audio, SoundCloudPlaylistAttrs } from './types';
import { logDebug } from '../../sub-log';
import { getPartTitle } from './tags';

export function playlistAttrs(
  audio: Audio,
  quality: AudioQuality,
): SoundCloudPlaylistAttrs {
  const document = audio.document;
  const friend = audio.friend;
  const lang = friend.lang;
  return {
    ...COMMON_ATTRS,
    permalink: permalink(audio, quality),
    label_name: lang === `en` ? `Friends Library Publishing` : `Biblioteca de los Amigos`,
    trackIds: [],
    title: utf8ShortTitle(document.title),
    description: document.description,
    tags: soundcloudTags(document.tags, quality, lang),
  };
}

function permalink(audio: Audio, quality: AudioQuality, suffix?: string): string {
  const edition = audio.edition;
  const document = audio.document;
  const editionSuffix = edition.type !== `updated` ? `-${edition.type}` : ``;
  const friend = audio.friend;
  let permalink = `${friend.slug}-${document.slug}${editionSuffix}${suffix ?? ``}`;
  if (quality === `lq`) {
    permalink += `-lq`;
  }
  return permalink;
}

export function trackAttrs(
  audio: Audio,
  partIndex: number,
  quality: AudioQuality,
): SoundCloudTrackAttrs {
  const document = audio.document;
  const friend = audio.friend;
  const lang = friend.lang;
  const numParts = audio.parts.length;
  let permalinkSuffix = ``;
  if (numParts > 1) {
    const partStr = String(partIndex + 1);
    permalinkSuffix = `-pt-${partStr.padStart(numParts > 9 ? 2 : 1, `0`)}`;
  }
  return {
    ...COMMON_ATTRS,
    permalink: permalink(audio, quality, permalinkSuffix),
    track_type: `spoken`,
    commentable: false,
    label_name: lang === `en` ? `Friends Library Publishing` : `Biblioteca de los Amigos`,
    title: getPartTitle(audio, partIndex),
    description: document.description,
    tags: soundcloudTags(document.tags, quality, lang),
  };
}

export function permalinkFromUrl(permalinkUrl: string): string {
  return permalinkUrl.split(`/`).pop() ?? ``;
}

export function attrsMatch(
  proposed: SoundCloudPlaylistAttrs | SoundCloudTrackAttrs,
  fromApi: Record<string, any>,
): boolean {
  return !Object.entries(proposed).reduce((foundNonMatch, [key, value]) => {
    if (foundNonMatch) {
      return true;
    }

    const verbose = process.argv.includes(`--verbose`);
    if (key === `trackIds`) {
      const apiTrackIds = fromApi.tracks.map((t: { id: number }) => t.id);
      const trackIdsMatch = JSON.stringify(apiTrackIds) !== JSON.stringify(value);
      if (verbose && trackIdsMatch) {
        logDebug(`soundcloud attrs mismatch: track ids to not match`);
      }
      return trackIdsMatch;
    }

    if (key === `tags`) {
      const apiTags = fromApi.tag_list
        .trim()
        .replace(/"/g, ``)
        .replace(/\s+/g, ` `)
        .split(` `)
        .sort()
        .join(` `);
      const newTags = value.sort().join(` `);
      const tagMismatch = apiTags !== newTags;
      if (verbose && tagMismatch) {
        logDebug(`soundcloud attrs mismatch [tags]: new=${newTags}, api=${apiTags}`);
      }
      return tagMismatch;
    }

    if (key === `permalink`) {
      const apiPerm = permalinkFromUrl(fromApi.permalink_url);
      const permalinkMismatch = value !== apiPerm;
      if (verbose && permalinkMismatch) {
        logDebug(`soundcloud attrs mismatch [permalink]: new=${value}, api=${apiPerm}`);
      }
      return permalinkMismatch;
    }

    const attrMismatch = fromApi[key] !== value;
    if (verbose && attrMismatch && key !== `track_type`) {
      logDebug(`soundcloud attrs mismatch: ${key} != ${value}, api=${fromApi[key]}`);
    }

    if (attrMismatch && key === `track_type`) {
      // soundcloud refuses to update this for some tracks... ¯\_(ツ)_/¯
      return foundNonMatch;
    }

    return attrMismatch;
  }, false);
}

function soundcloudTags(
  documentTags: string[],
  quality: AudioQuality,
  lang: Lang,
): string[] {
  setLocale(lang);
  return [
    ...documentTags.map((tag) =>
      translate(tag.replace(`spiritualLife`, `spiritual-life`)),
    ),
    lang === `en` ? `quakers` : `cuáqueros`,
    lang === `en` ? `early-quakers` : `primeros-cuáqueros`,
    lang === `en` ? `christianity` : `cristiandad`,
    lang === `en` ? `friends-library` : `biblioteca-de-los-amigos`,
    quality,
  ];
}

const COMMON_ATTRS = {
  genre: `Audiobooks`,
  sharing: `public`,
  embeddable_by: `all`,
  downloadable: true,
} as const;
