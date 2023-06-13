import invariant from 'tiny-invariant';
import type { CustomCode } from './custom-code';
import type { DocumentWithFriendMeta, FriendType } from '../types';
import { LANG } from '../env';
import { prisma } from './prisma';
import getAllCustomCode from './custom-code';

let friendsPromise: Promise<Record<string, FriendType>> | null = null;

export async function getAllFriends(): Promise<Record<string, FriendType>> {
  if (friendsPromise) {
    return friendsPromise;
  }
  friendsPromise = Promise.all([_getFriends(), getAllCustomCode()]).then(
    ([friends, customCode]) => addCustomCodeToFriends(friends, customCode),
  );
  return friendsPromise;
}

export default async function getFriend(
  friendSlug: string,
): Promise<FriendType | undefined> {
  const friends = await getAllFriends();
  return friends[friendSlug];
}

// { `friendSlug/documentSlug`: Document }
export async function getAllDocuments(): Promise<Record<string, DocumentWithFriendMeta>> {
  const friends = await getAllFriends();
  const documents: Record<string, DocumentWithFriendMeta> = {};
  Object.values(friends).forEach((friend) => {
    friend.documents.forEach((doc) => {
      documents[`${friend.slug}/${doc.slug}`] = {
        ...doc,
        authorGender: friend.gender,
        authorName: friend.name,
        authorSlug: friend.slug,
      };
    });
  });
  return documents;
}

async function _getFriends(): Promise<Record<string, FriendType>> {
  const publishedFriends = await prisma.friends.findMany({
    where: {
      lang: LANG,
    },
    select: {
      name: true,
      id: true,
      gender: true,
      slug: true,
      description: true,
      born: true,
      died: true,
      created_at: true,
      friend_quotes: {
        select: {
          text: true,
          source: true,
        },
      },
      friend_residences: {
        select: {
          city: true,
          region: true,
          friend_residence_durations: {
            select: {
              start: true,
              end: true,
            },
          },
        },
      },
      documents: {
        where: {
          editions: {
            some: {
              is_draft: false,
            },
          },
        },
        select: {
          title: true,
          created_at: true,
          slug: true,
          partial_description: true,
          id: true,
          document_tags: {
            select: {
              type: true,
            },
          },
          editions: {
            select: {
              type: true,
              is_draft: true,
              edition_audios: {
                select: {
                  id: true,
                },
              },
              isbns: {
                select: {
                  code: true,
                },
              },
              downloads: {
                select: {
                  id: true,
                },
              },
              edition_impressions: {
                select: {
                  paperback_size_variant: true,
                  paperback_volumes: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const friendProps = publishedFriends
    .map((friend) => {
      return {
        ...friend,
        quotes: friend.friend_quotes.map((q) => ({ quote: q.text, cite: q.source })),
        created_at: null,
        dateAdded: friend.created_at.toISOString(),
        residences: friend.friend_residences.map((r) => ({
          city: r.city,
          region: r.region,
          durations: r.friend_residence_durations,
        })),
        documents: friend.documents.map((doc) => {
          const firstEdition = doc.editions[0];
          invariant(firstEdition !== undefined);
          invariant(firstEdition.edition_impressions !== null);

          return {
            ...doc,
            created_at: null,
            dateAdded: doc.created_at.toISOString(),
            editionTypes: doc.editions.map((e) => e.type),
            shortDescription: doc.partial_description,
            hasAudio: doc.editions.some((e) => e.edition_audios?.id),
            tags: doc.document_tags.map((t) => t.type),
            numDownloads: firstEdition.downloads.length,
            numPages: firstEdition.edition_impressions.paperback_volumes,
            size: firstEdition.edition_impressions.paperback_size_variant,
            customCSS: null,
            customHTML: null,
          };
        }),
      };
    })
    .filter((friend) => friend.documents.length > 0);

  return friendProps.reduce<Record<string, FriendType>>((acc, friend) => {
    acc[friend.slug] = friend;
    return acc;
  }, {});
}

function addCustomCodeToFriends(
  friends: Record<string, FriendType>,
  customCode: Record<string, CustomCode>,
): Record<string, FriendType> {
  return Object.keys(friends).reduce<Record<string, FriendType>>((acc, friendSlug) => {
    const friend = friends[friendSlug];
    invariant(friend);
    const friendDocuments = friend.documents.map((document) => {
      const documentSlug = document.slug;
      const documentCustomCode = customCode[`${friendSlug}/${documentSlug}`];
      return {
        ...document,
        customCSS: documentCustomCode?.css ?? null,
        customHTML: documentCustomCode?.html ?? null,
      };
    });
    acc[friendSlug] = {
      ...friend,
      documents: friendDocuments,
    };
    return acc;
  }, {});
}
