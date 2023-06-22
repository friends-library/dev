import React from 'react';
import type { GetStaticProps } from 'next';
import type { DocumentWithMeta } from '@/lib/types';
import FeaturedBooksBlock from '@/components/pages/home/FeaturedBooksBlock';
import HeroBlock from '@/components/pages/home/HeroBlock';
import SubHeroBlock from '@/components/pages/home/SubHeroBlock';
import { getDocument } from '@/lib/db/documents';

export const getStaticProps: GetStaticProps<Props> = async () => {
  const featuredBooks = (
    await Promise.all([
      getDocument(`compilations`, `truth-in-the-inward-parts-v1`),
      getDocument(`hugh-turford`, `walk-in-the-spirit`),
      getDocument(`isaac-penington`, `writings-volume-1`),
      getDocument(`isaac-penington`, `writings-volume-2`),
      getDocument(`william-penn`, `no-cross-no-crown`),
      getDocument(`william-sewel`, `history-of-quakers`),
    ])
  ).filter((doc) => !!doc) as DocumentWithMeta[];
  return {
    props: {
      featuredBooks,
    },
  };
};

interface Props {
  featuredBooks: DocumentWithMeta[];
}

const Home: React.FC<Props> = ({ featuredBooks }) => (
  <main>
    <HeroBlock />
    <SubHeroBlock numTotalBooks={0} />
    <FeaturedBooksBlock books={featuredBooks} />
  </main>
);

export default Home;
