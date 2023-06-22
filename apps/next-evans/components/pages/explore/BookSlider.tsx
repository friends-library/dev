import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { Swipeable } from 'react-swipeable';
import { Front } from '@friends-library/cover-component';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { htmlShortTitle } from '@friends-library/adoc-utils';
import type { DocumentWithMeta } from '@/lib/types';
import { useWindowWidth } from '@/lib/hooks/window-width';
import { SCREEN_LG, SCREEN_MD, SCREEN_XL } from '@/lib/constants';
import { LANG } from '@/lib/env';
import Button from '@/components/core/Button';
import { getDocumentUrl, getFriendUrl, isCompilations } from '@/lib/friend';
import { mostModernEdition } from '@/lib/editions';

interface Props {
  books: Array<Omit<DocumentWithMeta, 'numPages' | 'size' | 'featuredDescription'>>;
  className?: string;
}

const BookSlider: React.FC<Props> = ({ books, className }) => {
  const winWidth = useWindowWidth();
  const [numHorizPages, booksPerHorizPage] = horizPages(books.length, winWidth);
  const [currentHorizPage, setCurrentHorizPage] = useState<number>(1);
  const [vertCutoff, setVertCutoff] = useState<number>(4);
  const canGoRight = numHorizPages > 0 && currentHorizPage < numHorizPages;
  const canGoLeft = numHorizPages > 0 && currentHorizPage > 1;
  const notMobile = winWidth >= SCREEN_MD;

  // reset position when books are updated
  useEffect(() => {
    setCurrentHorizPage(1);
    setVertCutoff(4);
  }, [books]);

  return (
    <Swipeable
      onSwipedRight={() =>
        notMobile && canGoLeft && setCurrentHorizPage(currentHorizPage - 1)
      }
      onSwipedLeft={() =>
        notMobile && canGoRight && setCurrentHorizPage(currentHorizPage + 1)
      }
      className={cx(
        className,
        `BookSlider md:overflow-hidden md:relative md:w-[670px] lg:w-[894px] xl:w-[1118px] 2xl:w-[1342px]`,
      )}
    >
      {canGoLeft && (
        <Arrow
          direction="left"
          onClick={() => setCurrentHorizPage(currentHorizPage - 1)}
        />
      )}
      {canGoRight && (
        <Arrow
          direction="right"
          onClick={() => setCurrentHorizPage(currentHorizPage + 1)}
        />
      )}
      <div
        className="md:flex transition-all duration-500 ease-in-out"
        style={{
          transform: `translateX(-${viewportOffset(
            currentHorizPage,
            winWidth,
            booksPerHorizPage,
          )}px`,
        }}
      >
        {books.map((book, idx) => (
          <div
            key={getDocumentUrl(book.authorSlug, book.slug)}
            className={cx(
              idx < vertCutoff ? `flex` : `hidden md:flex`,
              `BookSlider__Book max-w-xs flex-col items-center mb-12 px-10 text-center`,
              `md:px-6 md:mb-0 md:min-w-[224px] md:min-w-[224px]`,
            )}
          >
            <Link href={getDocumentUrl(book.authorSlug, book.slug)}>
              <Front
                author={book.authorName}
                edition={mostModernEdition(book.editionTypes)}
                customCss={book.customCSS ?? ``}
                customHtml={book.customHTML ?? ``}
                isCompilation={isCompilations(book.authorSlug)}
                lang={LANG}
                scaler={1 / 4}
                scope="1-4"
                shadow
                {...book}
                size={`m`}
              />
            </Link>
            <h3
              className="my-4 tracking-wider text-base text-flgray-900 md:mb-2 md:pb-1"
              dangerouslySetInnerHTML={{ __html: htmlShortTitle(book.title) }}
            />
            <Link
              href={getFriendUrl(book.authorSlug, book.authorGender)}
              className="fl-underline text-sm text-flprimary"
            >
              {book.authorName}
            </Link>
          </div>
        ))}
      </div>
      {numHorizPages > 1 && (
        <div className="hidden md:flex justify-center pt-4">
          {Array.from({ length: numHorizPages }).map((_, idx) => (
            <b
              key={`page-${idx + 1}`}
              onClick={() => setCurrentHorizPage(idx + 1)}
              className={cx(
                `px-2 text-3xl`,
                currentHorizPage === idx + 1 && `text-flgray-600`,
                currentHorizPage !== idx + 1 && `text-flgray-400 cursor-pointer`,
              )}
            >
              •
            </b>
          ))}
        </div>
      )}
      {vertCutoff < books.length && (
        <Button
          className="mx-auto md:hidden mb-6"
          onClick={() => setVertCutoff(vertCutoff + 4)}
        >
          Show more
        </Button>
      )}
    </Swipeable>
  );
};

export default BookSlider;

const Arrow: React.FC<{ direction: 'left' | 'right'; onClick: () => any }> = ({
  direction,
  onClick,
}) => (
  <div className="h-full" onClick={onClick}>
    <ChevronRightIcon
      className={cx(
        `z-50 cursor-pointer hover:text-black h-8`,
        `absolute text-2xl text-gray-700 px-8 opacity-25 cursor-pointer`,
        `transform -translate-y-1/2`,
        `top-[35%] hidden md:inline`,
        direction === `left` ? `-left-10 rotate-180` : `-right-10`,
      )}
    />
  </div>
);

function horizPages(numBooks: number, winWidth: number): [number, number] {
  if (winWidth < 0) {
    return [0, 500];
  }
  let booksPerPage = 3;
  if (winWidth > SCREEN_LG) {
    booksPerPage = 4;
  }
  if (winWidth > SCREEN_XL) {
    booksPerPage = 5;
  }
  if (winWidth > SCREEN_2XL) {
    booksPerPage = 6;
  }
  return [Math.ceil(numBooks / booksPerPage), booksPerPage];
}

function viewportOffset(
  currentHorizPage: number,
  winWidth: number,
  booksPerHorizPage: number,
): number {
  if (winWidth < SCREEN_MD) {
    return 0;
  }
  return (currentHorizPage - 1) * WIDTH_OF_BOOK_DIV * booksPerHorizPage;
}

const WIDTH_OF_BOOK_DIV = 224;
const SCREEN_2XL = SCREEN_XL + WIDTH_OF_BOOK_DIV;
