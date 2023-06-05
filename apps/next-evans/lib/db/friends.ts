// 1. make head req first, see which ones are 404s and then only get the ones that have custom code
// 2. put gh token in header
// 3. batch the promises

import invariant from 'tiny-invariant';
import type { Edition } from '../editions';
import type { CustomCode } from './custom-code';
import { LANG } from '../env';
import { prisma } from './prisma';
import getAllCustomCode from './custom-code';

export interface FriendProps {
  name: string;
  slug: string;
  gender: 'male' | 'female' | 'mixed';
  description: string;
  quotes: Array<{ quote: string; cite: string }>;
  born: number | null;
  died: number | null;
  residences: Array<{
    city: string;
    region: string;
    durations: Array<{ start: string; end: string }>;
  }>;
  documents: Array<{
    title: string;
    slug: string;
    id: string;
    editionTypes: Edition[];
    shortDescription: string;
    hasAudio: boolean;
    tags: Array<string>;
    numDownloads: number;
    numPages: number[];
    size: 's' | 'm' | 'xl' | 'xlCondensed';
    customCSS: string | null;
    customHTML: string | null;
  }>;
}

let friendsPromise: Promise<Record<string, FriendProps>> | null = null;

export async function getFriends(): Promise<Record<string, FriendProps>> {
  if (friendsPromise) {
    process.stdout.write(`cache used!\n`);
    return friendsPromise;
  }
  process.stdout.write(`fetching friends...\n`);
  friendsPromise = Promise.all([_getFriends(), getAllCustomCode()]).then(
    ([friends, customCode]) => addCustomCodeToFriends(friends, customCode),
  );
  return friendsPromise;
}

async function _getFriends(): Promise<Record<string, FriendProps>> {
  const publishedFriends = await prisma.friends.findMany({
    where: {
      lang: LANG,
    },
    select: {
      name: true,
      gender: true,
      slug: true,
      description: true,
      born: true,
      died: true,
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

  const friendProps = publishedFriends.map((friend) => {
    return {
      ...friend,
      quotes: friend.friend_quotes.map((q) => ({ quote: q.text, cite: q.source })),
      residences: friend.friend_residences.map((r) => ({
        city: r.city,
        region: r.region,
        durations: r.friend_residence_durations.map((d) => ({
          start: String(d.start),
          end: String(d.end),
        })),
      })),
      documents: friend.documents.map((doc) => {
        const firstEdition = doc.editions[0];
        invariant(firstEdition !== undefined);
        invariant(firstEdition.edition_impressions !== null);

        return {
          ...doc,
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
  });

  return friendProps.reduce<Record<string, FriendProps>>((acc, friend) => {
    acc[friend.slug] = friend;
    return acc;
  }, {});
}

export default async function getFriend(
  friendSlug: string,
): Promise<FriendProps | undefined> {
  const friends = await getFriends();
  return friends[friendSlug];
}

function addCustomCodeToFriends(
  friends: Record<string, FriendProps>,
  customCode: Record<string, CustomCode>,
): Record<string, FriendProps> {
  return Object.keys(friends).reduce<Record<string, FriendProps>>((acc, friendSlug) => {
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
