import React from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import type { GetStaticProps } from 'next';
import type { Period } from '@/lib/types';
import { APP_ALT_URL, LANG } from '@/lib/env';
import Dual from '@/components/core/Dual';
import NavBlock from '@/components/pages/explore/NavBlock';
import UpdatedEditionsBlock from '@/components/pages/explore/UpdatedEditionsBlock';
import GettingStartedLinkBlock from '@/components/pages/explore/GettingStartedLinkBlock';
import AudioBooksBlock from '@/components/pages/explore/AudioBooksBlock';
import NewBooksBlock from '@/components/pages/explore/NewBooksBlock';
import ExploreRegionsBlock from '@/components/pages/explore/RegionBlock';
import TimelineBlock from '@/components/pages/explore/TimelineBlock';
import AltSiteBlock from '@/components/pages/explore/AltSiteBlock';
import SearchBlock from '@/components/pages/explore/SearchBlock';
import { getDocumentUrl, getFriendUrl } from '@/lib/friend';
import { newestFirst } from '@/lib/dates';
import { documentDate, documentRegion } from '@/lib/document';
import * as custom from '@/lib/ssg/custom-code';
import Seo, { pageMetaDesc } from '@/components/core/Seo';
import api, { type Api } from '@/lib/ssg/api-client';
import BooksBgBlock from '@/components/core/BooksBgBlock';

type Props = {
  books: Api.ExplorePageBooks.Output;
  totalPublished: Api.TotalPublished.Output;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const props = await Promise.all([
    api.explorePageBooks(LANG),
    // api.totalPublished(),
    Promise.resolve({
      books: {
        en: 99,
        es: 99,
      },
      audiobooks: {
        en: 99,
        es: 99,
      },
    }),
    // custom.all(),
    // ]).then(([books, totalPublished, customCode]) => ({
  ]).then(([books, totalPublished]) => ({
    // books: books.map(custom.merging(customCode, (b) => [b.friendSlug, b.slug])),
    books,
    totalPublished,
  }));
  return { props };
};

const ExploreBooks: React.FC<Props> = ({ totalPublished, books }) => (
  <div>
    <Seo
      title={t`Explore Books`}
      description={pageMetaDesc(`explore`, {
        numBooks: totalPublished.books[LANG],
        numAudiobooks: totalPublished.audiobooks[LANG],
        numUpdatedEditions: books
          .map((book) => book.primaryEdition.type)
          .filter((type) => type === `updated`).length,
      })}
    />
    <BooksBgBlock eager>
      <WhiteOverlay>
        <Dual.H1 className="sans-wider text-3xl mb-6">
          <>Explore Books</>
          <>Explorar Libros</>
        </Dual.H1>
        <Dual.P className="body-text">
          <>
            We currently have {totalPublished.books[LANG]} books freely available on this
            site. Overwhelmed? On this page you can browse all the titles by edition,
            region, time period, tags, and more&mdash;or search the full library to find
            exactly what you’re looking for.
          </>
          <>
            Actualmente tenemos {totalPublished.books[LANG]} libros disponibles de forma
            gratuita en este sitio, y más están siendo traducidos y añadidos regularmente.
            En nuestra página de “Explorar” puedes navegar por todos nuestros libros y
            audiolibros, o buscar libros en la categoría particular que más te interese.
          </>
        </Dual.P>
      </WhiteOverlay>
    </BooksBgBlock>
    <NavBlock />
    <UpdatedEditionsBlock
      books={books
        .filter((book) => book.primaryEdition.type === `updated`)
        .sort(newestFirst)
        .map((book) => ({
          url: getDocumentUrl(book.friendSlug, book.slug),
          friendUrl: getFriendUrl(book.friendSlug, book.friendGender),
          isCompilation: book.isCompilation,
          editionType: book.primaryEdition.type,
          isbn: book.primaryEdition.isbn,
          title: book.title,
          htmlShortTitle: book.htmlShortTitle,
          friendName: book.friendName,
          friendSlug: book.friendSlug,
          customCss: book.customCss,
          customHtml: book.customHtml,
        }))}
    />
    <GettingStartedLinkBlock />
    <AudioBooksBlock
      books={books
        .filter((book) => book.hasAudio)
        .sort(newestFirst)
        .map((book) => ({
          url: getDocumentUrl(book.friendSlug, book.slug),
          isCompilation: book.isCompilation,
          editionType: book.primaryEdition.type,
          isbn: book.primaryEdition.isbn,
          title: book.title,
          htmlShortTitle: book.htmlShortTitle,
          friendName: book.friendName,
          friendSlug: book.friendSlug,
          customCss: book.customCss,
          customHtml: book.customHtml,
        }))}
    />
    <NewBooksBlock
      books={books
        .sort(newestFirst)
        .slice(0, 4)
        .map((book) => ({
          title: book.title,
          createdAt: book.createdAt,
          isCompilation: book.isCompilation,
          friendName: book.friendName,
          editionType: book.primaryEdition.type,
          paperbackVolumes: book.primaryEdition.paperbackVolumes,
          isbn: book.primaryEdition.isbn,
          description: book.shortDescription,
          htmlShortTitle: book.htmlShortTitle,
          documentUrl: getDocumentUrl(book.friendSlug, book.slug),
          friendUrl: getFriendUrl(book.friendSlug, book.friendGender),
        }))}
    />
    {LANG === `en` && (
      <ExploreRegionsBlock
        books={books
          .sort((a, b) => (a.friendName < b.friendName ? -1 : 1))
          .map((book) => ({
            title: book.title,
            htmlShortTitle: book.htmlShortTitle,
            isCompilation: book.isCompilation,
            friendName: book.friendName,
            editionType: book.primaryEdition.type,
            isbn: book.primaryEdition.isbn,
            url: getDocumentUrl(book.friendSlug, book.slug),
            friendUrl: getFriendUrl(book.friendSlug, book.friendGender),
            region: documentRegion(book),
          }))}
      />
    )}
    {LANG === `en` && (
      <TimelineBlock
        books={books.map((book) => ({
          title: book.title,
          htmlShortTitle: book.htmlShortTitle,
          friendName: book.friendName,
          editionType: book.primaryEdition.type,
          isbn: book.primaryEdition.isbn,
          url: getDocumentUrl(book.friendSlug, book.slug),
          friendUrl: getFriendUrl(book.friendSlug, book.friendGender),
          isCompilation: book.isCompilation,
          date: documentDate(book),
        }))}
      />
    )}
    <AltSiteBlock
      numBooks={totalPublished.books[LANG === `en` ? `es` : `en`]}
      url={APP_ALT_URL}
    />
    <SearchBlock
      books={books
        .flatMap((book) => book.editions.map((edition) => ({ book, edition })))
        .map(({ book, edition }) => ({
          isbn: edition.isbn,
          editionType: edition.type,
          tags: book.tags,
          authorName: book.friendName,
          authorSlug: book.friendSlug,
          customCss: book.customCss,
          customHtml: book.customHtml,
          isCompilation: book.isCompilation,
          documentTitle: book.title,
          documentSlug: book.slug,
          region: documentRegion(book),
          period: getPeriod(book.publishedYear),
        }))}
    />
  </div>
);

export default ExploreBooks;

export const WhiteOverlay: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div
    className={cx(
      `bg-white text-center py-12 md:py-16 lg:py-20 px-10 sm:px-16 my-6 max-w-screen-md mx-auto`,
      className,
    )}
  >
    {children}
  </div>
);

function getPeriod(date?: number): Period {
  if (!date) return `early`;
  if (date < 1725) return `early`;
  if (date < 1815) return `mid`;
  return `late`;
}
