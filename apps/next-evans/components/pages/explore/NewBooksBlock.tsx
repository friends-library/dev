import React from 'react';
import { t } from '@friends-library/locale';
import type { DocumentWithFriendMeta } from '@/lib/types';
import BookTeaserCards from './BookTeaserCards';

interface Props {
  books: DocumentWithFriendMeta[];
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
