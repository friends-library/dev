import React from 'react';
import { t } from '@friends-library/locale';
import type { CoverProps } from '@friends-library/types';
import type { GettingStartedCoverProps } from '@/pages/getting-started';
import PathBlock from './PathBlock';
import { LANG } from '@/lib/env';
import { getDocumentUrl, getFriendUrl, isCompilations } from '@/lib/friend';
import { mostModernEditionType } from '@/lib/editions';
import { editionTypes } from '@/lib/document';

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
    isCompilation: isCompilations(book.authorName),
    author: book.authorName,
    size: `s`,
    pages: 7,
    edition: mostModernEditionType(book.editions),
    isbn: ``,
    blurb: ``,
    customCss: book.customCSS || ``,
    customHtml: book.customHTML || ``,
    documentUrl: getDocumentUrl(book),
    authorUrl: getFriendUrl(book.authorSlug, book.authorGender),
    htmlShortTitle: book.title,
    hasAudio: book.hasAudio,
  }));
}
