import React from 'react';
import { t } from '@friends-library/locale';
import type { CoverProps } from '@friends-library/types';
import type { GettingStartedCoverProps } from '@/pages/getting-started';
import PathBlock from './PathBlock';
import { LANG } from '@/lib/env';
import { getFriendUrl, isCompilations } from '@/lib/friend';

interface Props {
  HistoryBlurb: React.FC;
  JournalsBlurb: React.FC;
  DevotionalBlurb: React.FC;
  DoctrineBlurb: React.FC;
  books: {
    history: Array<GettingStartedCoverProps>;
    doctrine: Array<GettingStartedCoverProps>;
    spiritualLife: Array<GettingStartedCoverProps>;
    journals: Array<GettingStartedCoverProps>;
  };
}

const GettingStartedPaths: React.FC<Props> = ({
  HistoryBlurb,
  DoctrineBlurb,
  DevotionalBlurb,
  JournalsBlurb,
  books,
}) => (
  <>
    <PathBlock
      slug="history"
      title={LANG === `en` ? `History of the Quakers` : `Historia de los Cuáqueros`}
      books={prepareBooks(books.history)}
      color="maroon"
    >
      <HistoryBlurb />
    </PathBlock>
    <PathBlock
      slug="doctrinal"
      title={LANG === `en` ? `The Quaker Doctrine` : `La Doctrina de los Cuáqueros`}
      books={prepareBooks(books.doctrine)}
      color="blue"
    >
      <DoctrineBlurb />
    </PathBlock>
    <PathBlock
      slug="spiritual-life"
      title={t`Spiritual Life`}
      books={prepareBooks(books.spiritualLife)}
      color="green"
    >
      <DevotionalBlurb />
    </PathBlock>
    <PathBlock
      slug="journal"
      title={LANG === `en` ? `Journals` : `Biográfico`}
      books={prepareBooks(books.journals)}
      color="gold"
    >
      <JournalsBlurb />
    </PathBlock>
  </>
);

export default GettingStartedPaths;

function prepareBooks(books: GettingStartedCoverProps[]): (CoverProps & {
  documentUrl: string;
  authorUrl: string;
  htmlShortTitle: string;
  hasAudio: boolean;
})[] {
  return books.map((book) => ({
    lang: LANG,
    title: book.title,
    isCompilation: isCompilations(book.author),
    author: book.author,
    size: `s`,
    pages: 7,
    edition: book.edition,
    isbn: ``,
    blurb: ``,
    customCss: book.customCss,
    customHtml: book.customHtml,
    documentUrl: `/${book.authorSlug}/${book.documentSlug}`,
    authorUrl: getFriendUrl(book.authorSlug, book.authorGender),
    htmlShortTitle: book.title,
    hasAudio: book.hasAudio,
  }));
}
