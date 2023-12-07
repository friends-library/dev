import React from 'react';
import { t } from '@friends-library/locale';
import BookTeaserCards, {
  type Props as BookTeaserCardsProps,
} from '@/components/core/BookTeaserCards';

interface Props {
  books: BookTeaserCardsProps['books'];
}

const NewBooksBlock: React.FC<Props> = ({ books }) => (
  <BookTeaserCards
    id="NewBooksBlock"
    bgColor="flblue"
    titleTextColor="white"
    title={t`Recently Added Books`}
    titleEl="h2"
    books={books}
    sortBy="createdAt"
    withDateBadges
  />
);

export default NewBooksBlock;
