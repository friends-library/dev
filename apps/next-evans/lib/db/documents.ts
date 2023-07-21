import type { Lang } from '@friends-library/types';
import type { Document } from '../types';
import { LANG } from '../env';
import { publishedYear, publicationRegion } from '../document';
import { getAllFriends } from './friends';

export async function getAllDocuments(
  lang: Lang = LANG,
): Promise<Record<string, Document>> {
  const friends = await getAllFriends(lang);
  const documents: Record<string /* `friendSlug/documentSlug` */, Document> = {};
  Object.values(friends).forEach((friend) => {
    friend.documents.forEach((doc) => {
      documents[`${friend.slug}/${doc.slug}`] = {
        ...doc,
        publishedRegion: publicationRegion(friend.residences),
        publishedYear: publishedYear(friend.residences, friend.born, friend.died),
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
): Promise<Document | undefined> {
  const documents = await getAllDocuments();
  return documents[`${friendSlug}/${documentSlug}`];
}

export async function getNumDocuments(lang: Lang): Promise<number> {
  return Object.values(await getAllDocuments(lang)).length;
}
