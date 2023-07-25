import React from 'react';
import { htmlShortTitle } from '@friends-library/adoc-utils';
import invariant from 'tiny-invariant';
import Link from 'next/link';
import { t } from '@friends-library/locale';
import type { GetStaticProps } from 'next';
import type { Doc } from '@/lib/types';
import AudiobooksHero from '@/components/pages/explore/AudiobooksHero';
import Dual from '@/components/core/Dual';
import BookTeaserCard from '@/components/core/BookTeaserCard';
import { getDocumentUrl, getFriendUrl } from '@/lib/friend';
import { getAllDocuments } from '@/lib/db/documents';
import { isNotNullish } from '@/lib/utils';
import { formatDuration, formatMonthDay, newestFirst } from '@/lib/dates';
import { LANG } from '@/lib/env';
import Audiobook from '@/components/pages/audiobooks/Audiobook';

export const getStaticProps: GetStaticProps<Props> = async () => {
  const sortedBooks = Object.values(await getAllDocuments())
    .filter((book) => book.hasAudio)
    .filter(isNotNullish)
    .sort(newestFirst);
  return {
    props: {
      numAudioBooks: sortedBooks.length,
      sortedBooks,
    },
  };
};

interface Props {
  numAudioBooks: number;
  sortedBooks: Array<
    Doc<'editions' | 'authorGender' | 'shortDescription' | 'mostModernEdition'>
  >;
}

const AudioBooks: React.FC<Props> = ({ numAudioBooks, sortedBooks }) => (
  <div className="">
    <AudiobooksHero numBooks={numAudioBooks} className="pb-52" />
    <div className="bg-flgray-200 py-12 xl:pb-6">
      <Dual.H2 className="sans-wider text-center text-2xl md:text-3xl mb-12 px-10">
        <>Recently Added Audio Books</>
        <>Audiolibros añadidos recientemente</>
      </Dual.H2>
      <div className="flex flex-col xl:flex-row items-center justify-center gap-12 xl:gap-28 px-12 xl:px-28 xl:pl-36">
        {sortedBooks.slice(0, 2).map((book) => {
          const audiobook = book.mostModernEdition.audiobook;
          invariant(audiobook);
          return (
            <BookTeaserCard
              {...book}
              editions={book.editions}
              htmlShortTitle={htmlShortTitle(book.title)}
              documentUrl={getDocumentUrl(book)}
              authorUrl={getFriendUrl(book.authorName, book.authorGender)}
              description={book.shortDescription}
              key={getDocumentUrl(book)}
              className="xl:-ml-8"
              badgeText={formatMonthDay(audiobook.createdAt, LANG)}
              audioDuration={formatDuration(audiobook.duration)}
            />
          );
        })}
      </div>
    </div>
    <div>
      <div className="pt-24">
        <h2 className="sans-wider text-center text-3xl mb-8 px-8">{t`All Audio Books`}</h2>
        <Dual.P className="body-text text-center text-lg mb-12 px-8 sm:px-10">
          <>
            Browse all {sortedBooks.length} audiobooks below, or{` `}
            <Link href={t`/audio-help`} className="subtle-link">
              get help with listening here
            </Link>
            .
          </>
          <>
            Explora los {sortedBooks.length} audiolibros a continuación u{` `}
            <Link href={t`/audio-help`} className="subtle-link">
              obtén ayuda aquí para escuchar
            </Link>
            .
          </>
        </Dual.P>
      </div>
      <div className="flex gap-x-8 gap-y-36 flex-wrap justify-center py-24 px-4 sm:px-8">
        {sortedBooks.map((book, index) => {
          const audiobook = book.mostModernEdition.audiobook;
          invariant(audiobook);
          const bgColor = (() => {
            switch (index % 3) {
              case 0:
                return `blue`;
              case 1:
                return `green`;
              case 2:
              default:
                return `gold`;
            }
          })();
          return (
            <Audiobook
              isbn={book.isbn}
              title={htmlShortTitle(book.title)}
              slug={book.slug}
              customCSS={book.customCSS}
              customHTML={book.customHTML}
              authorName={book.authorName}
              authorSlug={book.authorSlug}
              authorGender={book.authorGender}
              shortDescription={book.shortDescription}
              bgColor={bgColor}
              duration={audiobook.duration}
              mostModernEdition={book.mostModernEdition}
            />
          );
        })}
      </div>
    </div>
  </div>
);

export default AudioBooks;
