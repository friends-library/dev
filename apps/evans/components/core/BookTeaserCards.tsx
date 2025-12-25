import React from 'react';
import cx from 'classnames';
import type { CoverData } from '@/lib/cover';
import type { EditionType } from '@/lib/types';
import BookTeaserCard from './BookTeaserCard';
import { shortDate } from '@/lib/dates';

type Book = Omit<CoverData, `printSize`> & {
  audioDuration?: string;
  htmlShortTitle: string;
  documentUrl: string;
  friendUrl: string;
  createdAt: ISODateString;
};

export interface Props {
  className?: string;
  id?: string;
  title: string;
  titleEl: `h2` | `h3` | `h4`;
  bgColor: string;
  titleTextColor: string;
  books: Book[];
  sortBy?: `edition,title` | `createdAt`;
  withDateBadges?: boolean;
}

const BookTeaserCards: React.FC<Props> = ({
  id,
  className,
  title,
  bgColor,
  titleTextColor,
  books,
  titleEl: TitleEl,
  sortBy = `edition,title`,
  withDateBadges = false,
}) => {
  if (books.length === 0) return null;
  return (
    <section
      id={id}
      className={cx(
        className,
        `bg-${bgColor}`,
        `pb-16`,
        `md:pt-16 md:pb-28`,
        `xl:flex xl:flex-wrap xl:justify-center`,
      )}
    >
      <TitleEl
        className={cx(
          `text-${titleTextColor}`,
          `sans-wider px-6 text-2xl text-center pt-10 md:pt-0 md:-mt-2 mb-52 md:mb-12 xl:w-full`,
        )}
      >
        {title}
      </TitleEl>
      <div className="flex flex-wrap justify-center gap-x-12 2xl:gap-x-16 gap-y-52 md:gap-y-28 px-0 sm:px-16 lg:px-12">
        {books.sort(makeSorter(sortBy)).map((book) => (
          <BookTeaserCard
            key={book.documentUrl}
            badgeText={withDateBadges ? shortDate(book.createdAt) : undefined}
            {...book}
          />
        ))}
      </div>
    </section>
  );
};

export default BookTeaserCards;

// helpers

type SortableBook = {
  editionType: EditionType;
  title: string;
  createdAt: ISODateString;
};

function makeSorter(
  strategy: `edition,title` | `createdAt`,
): (a: SortableBook, b: SortableBook) => -1 | 0 | 1 {
  return (a, b) => {
    if (strategy === `createdAt`) {
      return a.createdAt < b.createdAt ? 1 : -1;
    }
    if (a.editionType !== b.editionType) {
      if (a.editionType === `updated`) {
        return -1;
      }
      if (a.editionType === `modernized`) {
        return b.editionType === `updated` ? 1 : -1;
      }
      return 1;
    }
    return a.title < b.title ? -1 : 1;
  };
}
