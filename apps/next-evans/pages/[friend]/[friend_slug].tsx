import { PrismaClient } from '@prisma/client';
import invariant from 'tiny-invariant';
import type { GetStaticPaths, GetStaticProps } from 'next';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import { LANG } from '../../lib/env';
import { Edition, mostModernEdition } from '../../lib/editions';
import FriendBlock from '../../components/pages/friend/FriendBlock';
import FeaturedQuoteBlock from '../../components/pages/friend/FeaturedQuoteBlock';
import BookByFriend from '../../components/pages/friend/BookByFriend';
import TestimonialsBlock from '../../components/pages/friend/TestimonialsBlock';

const client = new PrismaClient();

export const getStaticPaths: GetStaticPaths = async () => {
  const allFriends = await client.friends.findMany({
    where: { lang: LANG },
    select: { slug: true, gender: true },
  });

  const paths = allFriends.map((friend) => {
    if (LANG === `en`) {
      return {
        params: { friend: 'friend', friend_slug: friend.slug },
      };
    }
    return {
      params: {
        friend: friend.gender === 'female' ? 'amiga' : 'amigo',
        friend_slug: friend.slug,
      },
    };
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  invariant(typeof context.params?.friend_slug === `string`);
  const friend = await client.friends.findFirst({
    where: {
      slug: context.params.friend_slug,
      lang: LANG,
    },
    select: {
      name: true,
      gender: true,
      slug: true,
      description: true,
      friend_quotes: {
        select: {
          text: true,
          source: true,
        },
      },
      documents: {
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
  const friendProps = {
    ...friend,
    quotes: friend.friend_quotes.map((q) => ({ quote: q.text, cite: q.source })),
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
      };
    }),
  };
  return {
    props: friendProps,
  };
};

interface Props {
  name: string;
  slug: string;
  gender: 'male' | 'female' | 'mixed';
  description: string;
  quotes: Array<{ quote: string; cite: string }>;
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
  }>;
}

const Friend: React.FC<Props> = ({
  name,
  gender,
  slug,
  description,
  quotes,
  documents,
}) => {
  const onlyOneBook = documents.length === 1;
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
              if (doc.editionTypes.includes('updated')) {
                return -1;
              }
              if (doc.editionTypes.includes('modernized')) {
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
                  blurb={''} // never see the back of a book in this component
                  isCompilation={gender === `mixed`}
                  author={name}
                  size={docSizeProp}
                  edition={mostModernEdition(doc.editionTypes)}
                  isbn={''} // never see the isbn either
                  // todo
                  customCss={''}
                  customHtml={''}
                />
              );
            })}
        </div>
      </div>
      <TestimonialsBlock testimonials={quotes.slice(1, quotes.length)} />
    </div>
  );
};

export default Friend;
