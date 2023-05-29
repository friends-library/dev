import React from 'react';
import { PrismaClient } from '@prisma/client';
import invariant from 'tiny-invariant';
import cx from 'classnames';
import { t, translateOptional as trans } from '@friends-library/locale';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { Edition } from '@/lib/editions';
import { LANG } from '@/lib/env';
import { mostModernEdition } from '@/lib/editions';
import FriendBlock from '@/components/pages/friend/FriendBlock';
import FeaturedQuoteBlock from '@/components/pages/friend/FeaturedQuoteBlock';
import BookByFriend from '@/components/pages/friend/BookByFriend';
import TestimonialsBlock from '@/components/pages/friend/TestimonialsBlock';
import MapBlock from '@/components/pages/friend/MapBlock';
import getResidences from '@/lib/residences';

const client = new PrismaClient();

export const getStaticPaths: GetStaticPaths = async () => {
  const allFriends = await client.friends.findMany({
    where: { lang: LANG },
    select: {
      slug: true,
      gender: true,
      documents: { select: { editions: { select: { is_draft: true } } } },
    },
  });

  const publishedFriends = allFriends.filter((friend) =>
    friend.documents.some((doc) => doc.editions.some((edition) => !edition.is_draft)),
  );

  const paths = publishedFriends.map((friend) => {
    if (LANG === `en`) {
      return {
        params: { friend: `friend`, friend_slug: friend.slug },
      };
    }
    return {
      params: {
        friend: friend.gender === `female` ? `amiga` : `amigo`,
        friend_slug: friend.slug,
      },
    };
  });

  return { paths, fallback: false };
};

async function getFriend(slug: string): Promise<Props> {
  const friend = await client.friends.findFirst({
    where: {
      slug,
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
  invariant(friend !== null);
  const customCode = await getCustomCode(
    friend.slug,
    friend.documents.map((d) => d.slug),
  );

  const friendProps = {
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
        customCSS: customCode[doc.slug]?.css || null,
        customHTML: customCode[doc.slug]?.html || null,
      };
    }),
  };
  return friendProps;
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  invariant(typeof context.params?.friend_slug === `string`);
  const friend = await getFriend(context.params.friend_slug);

  return {
    props: friend,
  };
};

interface Props {
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

const Friend: React.FC<Props> = ({
  name,
  gender,
  slug,
  description,
  quotes,
  documents,
  residences,
  born,
  died,
}) => {
  const onlyOneBook = documents.length === 1;
  const isCompilations = name.startsWith(`Compila`);
  const mapData = getResidences(residences);
  let mapBlock;
  if (!isCompilations) {
    invariant(mapData[0] !== undefined);
    mapBlock = (
      <MapBlock
        friendName={name}
        residences={residences.flatMap((r) => {
          const place = `${trans(r.city)}, ${trans(r.region)}`;
          if (r.durations) {
            return r.durations.map((d) => `${place} (${d.start} - ${d.end})`);
          }
          let residence = place;
          if (born && died) {
            residence += ` (${born} - ${died})`;
          } else if (died) {
            residence += ` (died: ${died})`;
          }
          return residence;
        })}
        map={mapData[0].map}
        markers={mapData.map((res) => ({
          label: `${trans(res.city)}, ${trans(res.region)}`,
          top: res.top,
          left: res.left,
        }))}
      />
    );
  }

  return (
    <div>
      <FriendBlock name={name} gender={gender} blurb={description} />
      {quotes[0] && <FeaturedQuoteBlock cite={quotes[0].cite} quote={quotes[0].quote} />}
      <div className="bg-flgray-100 px-8 pt-12 pb-4 lg:px-8">
        <h2 className="text-xl font-sans text-center tracking-wider font-bold mb-8">
          {name === `Compilations`
            ? t`All Compilations (${documents.length})`
            : t`Books by ${name}`}
        </h2>
        <div
          className={cx(`flex flex-col items-center `, `xl:justify-center`, {
            'lg:flex-row lg:justify-between lg:flex-wrap lg:items-stretch': !onlyOneBook,
          })}
        >
          {documents
            .sort((doc) => {
              if (doc.editionTypes.includes(`updated`)) {
                return -1;
              }
              if (doc.editionTypes.includes(`modernized`)) {
                return 0;
              }
              return 1;
            })
            .map((doc) => {
              const docSizeProp = doc.size === `xlCondensed` ? `xl` : doc.size;
              return (
                <BookByFriend
                  key={doc.id}
                  htmlShortTitle={doc.title
                    .replace(/Volume/g, `Vol.`)
                    .replace(/--/g, `—`)}
                  isAlone={onlyOneBook}
                  className="mb-8 lg:mb-12"
                  tags={doc.tags}
                  hasAudio={doc.hasAudio}
                  bookUrl={`/${slug}/${doc.slug}`}
                  numDownloads={doc.numDownloads}
                  pages={doc.numPages}
                  description={doc.shortDescription}
                  lang={LANG}
                  title={doc.title.replace(/-- Volume \d/g, ``)}
                  blurb={``} // never see the back of a book in this component
                  isCompilation={gender === `mixed`}
                  author={name}
                  size={docSizeProp}
                  edition={mostModernEdition(doc.editionTypes)}
                  isbn={``} // never see the isbn either
                  customCss={doc.customCSS || ``}
                  customHtml={doc.customHTML || ``}
                />
              );
            })}
        </div>
      </div>
      {mapBlock}
      <TestimonialsBlock testimonials={quotes.slice(1, quotes.length)} />
    </div>
  );
};

export default Friend;

function getCustomCode(
  slug: string,
  documents: string[],
): Promise<Record<string, { css?: string; html?: string }>> {
  return Promise.all(
    documents.map((document) =>
      Promise.all([getCode(slug, document, `css`), getCode(slug, document, `html`)]).then(
        ([css, html]) => ({ css, html, slug: document }),
      ),
    ),
  ).then((codes) =>
    codes.reduce((acc: Record<string, { css?: string; html?: string }>, code) => {
      acc[code.slug] = { css: code.css, html: code.html };
      return acc;
    }, {}),
  );
}

async function getCode(
  friend: string,
  document: string,
  type: 'css' | 'html',
): Promise<string | undefined> {
  const res = await fetch(
    `https://raw.githubusercontent.com/${
      LANG === `en` ? `friends-library` : `biblioteca-de-los-amigos`
    }/${friend}/master/${document}/paperback-cover.${type}`,
  );
  if (res.status === 404) {
    return undefined;
  }
  return res.text();
}
