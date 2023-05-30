import React from 'react';
import { t } from '@friends-library/locale';
import type { CoverProps } from '@friends-library/types';
import type { NeededCoverProps } from '@/pages/getting-started';
import PathBlock from './PathBlock';
import { LANG } from '@/lib/env';

interface Props {
  HistoryBlurb: React.FC;
  JournalsBlurb: React.FC;
  DevotionalBlurb: React.FC;
  DoctrineBlurb: React.FC;
  books: {
    history: Array<NeededCoverProps>;
    doctrine: Array<NeededCoverProps>;
    spiritualLife: Array<NeededCoverProps>;
    journals: Array<NeededCoverProps>;
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

function prepareBooks(books: NeededCoverProps[]): (CoverProps & {
  documentUrl: string;
  authorUrl: string;
  htmlShortTitle: string;
  hasAudio: boolean;
})[] {
  return books.map((book) => ({
    lang: LANG,
    title: book.title,
    isCompilation: book.author.startsWith(`Compila`),
    author: book.author,
    size: `s`,
    pages: 7,
    edition: book.edition,
    isbn: ``,
    blurb: ``,
    customCss: book.customCss,
    customHtml: book.customHtml,
    documentUrl: `#`,
    authorUrl: `/${LANG === `en` ? `friend` : `amigo`}/${book.authorSlug}`,
    htmlShortTitle: book.title,
    hasAudio: book.hasAudio,
  }));
}
