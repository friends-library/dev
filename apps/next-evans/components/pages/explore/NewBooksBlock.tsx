import React from 'react';
import { t } from '@friends-library/locale';
import type { Doc } from '@/lib/types';
import BookTeaserCards from './BookTeaserCards';

interface Props {
  books: Array<Doc<'editions' | 'createdAt' | 'authorGender' | 'shortDescription'>>;
}

const NewBooksBlock: React.FC<Props> = ({ books }) => (
  <BookTeaserCards
    id="NewBooksBlock"
    bgColor="flblue"
    titleTextColor="white"
    title={t`Recently Added Books`}
    titleEl="h2"
    books={books}
  />
);

export default NewBooksBlock;
