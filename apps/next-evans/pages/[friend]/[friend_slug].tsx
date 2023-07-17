import React from 'react';
import invariant from 'tiny-invariant';
import cx from 'classnames';
import { t, translateOptional as trans } from '@friends-library/locale';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Friend } from '@/lib/types';
import { LANG } from '@/lib/env';
import { mostModernEditionType } from '@/lib/editions';
import FriendBlock from '@/components/pages/friend/FriendBlock';
import FeaturedQuoteBlock from '@/components/pages/friend/FeaturedQuoteBlock';
import BookByFriend from '@/components/pages/friend/BookByFriend';
import TestimonialsBlock from '@/components/pages/friend/TestimonialsBlock';
import MapBlock from '@/components/pages/friend/MapBlock';
import getResidences from '@/lib/residences';
import { getDocumentUrl, isCompilations } from '@/lib/friend';
import getFriend, { getAllFriends } from '@/lib/db/friends';
import { editionTypes } from '@/lib/document';

export const getStaticPaths: GetStaticPaths = async () => {
  const friends = await getAllFriends();

  const paths = Object.values(friends).map((friend) => {
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

export const getStaticProps: GetStaticProps<Friend> = async (context) => {
  invariant(typeof context.params?.friend_slug === `string`);
  const friend = await getFriend(context.params.friend_slug);
  invariant(friend);

  return {
    props: friend,
  };
};

const Friend: React.FC<Friend> = ({
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
  const mapData = getResidences(residences);
  let mapBlock;
  if (!isCompilations(name)) {
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
              if (editionTypes(doc.editions).includes(`updated`)) {
                return -1;
              }
              if (editionTypes(doc.editions).includes(`modernized`)) {
                return 0;
              }
              return 1;
            })
            .map((doc) => {
              const docSizeProp =
                doc.mostModernEdition.size === `xlCondensed`
                  ? `xl`
                  : doc.mostModernEdition.size;
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
                  bookUrl={getDocumentUrl(slug, doc.slug)}
                  numDownloads={doc.numDownloads}
                  pages={doc.mostModernEdition.numPages}
                  description={doc.shortDescription}
                  lang={LANG}
                  title={doc.title.replace(/-- Volume \d/g, ``)}
                  blurb={``} // never see the back of a book in this component
                  isCompilation={gender === `mixed`}
                  author={name}
                  size={docSizeProp}
                  edition={mostModernEditionType(doc.editions)}
                  isbn={doc.isbn}
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
