import invariant from 'tiny-invariant';
import type { Lang } from '@friends-library/types';
import type { CustomCode } from './custom-code';
import type { Edition, Friend } from '../types';
import { LANG } from '../env';
import { mostModernEditionType } from '../editions';
import { prisma } from './prisma';
import getAllCustomCode from './custom-code';

const friendsPromise: {
  en: Promise<Record<string, Friend>> | null;
  es: Promise<Record<string, Friend>> | null;
} = { en: null, es: null };

export async function getAllFriends(lang: Lang = LANG): Promise<Record<string, Friend>> {
  let languageSpecificFriends = friendsPromise[lang];
  if (languageSpecificFriends) {
    return languageSpecificFriends;
  }
  languageSpecificFriends = Promise.all([
    getFriendsFromDB(lang),
    getAllCustomCode(),
  ]).then(([friends, customCode]) => addCustomCodeToFriends(friends, customCode));
  friendsPromise[lang] = languageSpecificFriends;
  return languageSpecificFriends;
}

export default async function getFriend(friendSlug: string): Promise<Friend | undefined> {
  const friends = await getAllFriends();
  return friends[friendSlug];
}

async function getFriendsFromDB(lang: Lang): Promise<Record<string, Friend>> {
  const publishedFriends = await queryFriends(lang);
  const friendProps = publishedFriends
    .map((friend) => {
      return {
        ...friend,
        quotes: friend.friend_quotes.map((q) => ({ quote: q.text, cite: q.source })),
        created_at: null,
        createdAt: friend.created_at.toISOString(),
        residences: friend.friend_residences.map((r) => ({
          city: r.city,
          region: r.region,
          durations: r.friend_residence_durations,
        })),
        documents: friend.documents.map((doc) => {
          const firstEdition = doc.editions[0];
          invariant(firstEdition !== undefined);
          invariant(firstEdition.edition_impressions !== null);
          const newestEdition = doc.editions.find(
            (edition) => edition.type === mostModernEditionType(doc.editions),
          );
          invariant(newestEdition !== undefined);

          return {
            ...doc,
            altLanguageId: doc.alt_language_id,
            created_at: null,
            isbn: firstEdition.isbns[0]?.code ?? ``,
            createdAt: doc.created_at.toISOString(),
            featuredDescription: doc.featured_description,
            mostModernEdition: toEdition(newestEdition),
            editions: doc.editions.map(toEdition),
            shortDescription: doc.partial_description,
            hasAudio: doc.editions.some((e) => e.edition_audios?.id),
            tags: doc.document_tags.map((t) => t.type),
            numDownloads: doc.editions.reduce((acc, ed) => acc + ed.downloads.length, 0),
            customCSS: null,
            customHTML: null,
            authorSlug: friend.slug,
          };
        }),
      };
    })
    .filter((friend) => friend.documents.length > 0);

  return friendProps.reduce<Record<string, Friend>>((acc, friend) => {
    acc[friend.slug] = friend;
    return acc;
  }, {});
}

type DBEdition = Awaited<
  ReturnType<typeof queryFriends>
>[number]['documents'][number]['editions'][number];

function toEdition(dbEdition: DBEdition): Edition {
  const audiobook = dbEdition.edition_audios;
  invariant(dbEdition.edition_impressions !== null); // TODO ~ prisma types are wrong
  return {
    type: dbEdition.type,
    impressionCreatedAt: dbEdition.edition_impressions.created_at.toISOString(),
    numPages: dbEdition.edition_impressions.paperback_volumes,
    size: dbEdition.edition_impressions.paperback_size_variant,
    audiobook: audiobook && {
      id: audiobook.id,
      isIncomplete: audiobook.is_incomplete,
      createdAt: audiobook.created_at.toISOString(),
    },
  };
}

function addCustomCodeToFriends(
  friends: Record<string, Friend>,
  customCode: Record<string, CustomCode>,
): Record<string, Friend> {
  return Object.keys(friends).reduce<Record<string, Friend>>((acc, friendSlug) => {
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function queryFriends(lang: Lang) {
  return prisma.friends.findMany({
    where: {
      lang,
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
          featured_description: true,
          id: true,
          alt_language_id: true,
          document_tags: {
            select: {
              type: true,
            },
          },
          editions: {
            where: {
              edition_impressions: {
                isNot: null,
              },
            },
            select: {
              type: true,
              is_draft: true,
              edition_audios: {
                select: {
                  id: true,
                  created_at: true,
                  is_incomplete: true,
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
                  created_at: true,
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
}
