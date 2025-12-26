import React from 'react';
import { t } from '@friends-library/locale';
import PathBlock, { type Props as PathBlockProps } from './PathBlock';
import { LANG } from '@/lib/env';

interface Props {
  HistoryBlurb: React.FC;
  JournalsBlurb: React.FC;
  DevotionalBlurb: React.FC;
  DoctrineBlurb: React.FC;
  books: {
    history: PathBlockProps[`books`];
    doctrine: PathBlockProps[`books`];
    spiritualLife: PathBlockProps[`books`];
    journals: PathBlockProps[`books`];
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
      books={books.history}
      color="maroon"
    >
      <HistoryBlurb />
    </PathBlock>
    <PathBlock
      slug="doctrinal"
      title={LANG === `en` ? `The Quaker Doctrine` : `La Doctrina de los Cuáqueros`}
      books={books.doctrine}
      color="blue"
    >
      <DoctrineBlurb />
    </PathBlock>
    <PathBlock
      slug="spiritual-life"
      title={t`Spiritual Life`}
      books={books.spiritualLife}
      color="green"
    >
      <DevotionalBlurb />
    </PathBlock>
    <PathBlock
      slug="journal"
      title={LANG === `en` ? `Journals` : `Biográfico`}
      books={books.journals}
      color="gold"
    >
      <JournalsBlurb />
    </PathBlock>
  </>
);

export default GettingStartedPaths;
