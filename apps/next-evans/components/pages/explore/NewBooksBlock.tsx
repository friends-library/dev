import React from 'react';
import { t } from '@friends-library/locale';
import type { Document } from '@/lib/types';
import BookTeaserCards from './BookTeaserCards';

interface Props {
  books: Array<
    Pick<
      Document,
      | 'title'
      | 'slug'
      | 'editions'
      | 'shortDescription'
      | 'customCSS'
      | 'customHTML'
      | 'createdAt'
      | 'authorSlug'
      | 'authorName'
      | 'authorGender'
      | 'isbn'
    >
  >;
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
