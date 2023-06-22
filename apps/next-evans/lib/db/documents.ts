import type { Lang } from '@friends-library/types';
import type { DocumentWithMeta } from '../types';
import { LANG } from '../env';
import { getPublicationDate, getPublicationRegion } from '../document';
import { getAllFriends } from './friends';

// { `friendSlug/documentSlug`: Document }
export async function getAllDocuments(
  lang: Lang = LANG,
): Promise<Record<string, DocumentWithMeta>> {
  const friends = await getAllFriends(lang);
  const documents: Record<string, DocumentWithMeta> = {};
  Object.values(friends).forEach((friend) => {
    friend.documents.forEach((doc) => {
      documents[`${friend.slug}/${doc.slug}`] = {
        ...doc,
        publishedRegion: getPublicationRegion(friend.residences),
        publishedDate: getPublicationDate(friend.residences, friend.born, friend.died),
        authorGender: friend.gender,
        authorName: friend.name,
        authorSlug: friend.slug,
      };
    });
  });
  return documents;
}

export async function getDocument(
  friendSlug: string,
  documentSlug: string,
): Promise<DocumentWithMeta | undefined> {
  const documents = await getAllDocuments();
  return documents[`${friendSlug}/${documentSlug}`];
}

export async function getNumDocuments(lang: Lang): Promise<number> {
  return Object.values(await getAllDocuments(lang)).length;
}
