import type { Lang } from '@friends-library/types';
import type { Audio } from './types';
import api from '../../api-client';

export default async function queryFilteredAudios(
  lang: Lang | `both`,
  pattern?: string,
  limit?: number,
): Promise<Audio[]> {
  const audios = await api.getAudios();
  audios.sort((a, b) => (a.edition.path < b.edition.path ? -1 : 1));
  for (const audio of audios) {
    audio.parts = audio.parts.sort((a, b) => (a.order < b.order ? -1 : 1));
  }
  return audios
    .filter((audio) => {
      if (lang !== `both` && lang !== audio.friend.lang) {
        return false;
      }
      if (pattern && !audio.edition.path.includes(pattern)) {
        return false;
      }
      return true;
    })
    .slice(0, limit ?? Infinity);
}
