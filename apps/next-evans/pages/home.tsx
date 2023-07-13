import React from 'react';
import type { GetStaticProps } from 'next';
import type { DocumentWithMeta } from '@/lib/types';
import type { FeedItem } from '@/components/pages/home/news-feed/news-feed';
import FeaturedBooksBlock from '@/components/pages/home/FeaturedBooksBlock';
import HeroBlock from '@/components/pages/home/HeroBlock';
import SubHeroBlock from '@/components/pages/home/SubHeroBlock';
import { getAllDocuments } from '@/lib/db/documents';
import GettingStartedBlock from '@/components/pages/home/GettingStartedBlock';
import WhoWereTheQuakersBlock from '@/components/pages/home/WhoWereTheQuakersBlock';
import FormatsBlock from '@/components/pages/home/FormatsBlock';
import ExploreBooksBlock from '@/components/pages/home/ExploreBooksBlock';
import NewsFeedBlock from '@/components/pages/home/news-feed/NewsFeedBlock';
import { getNewsFeedItems } from '@/components/pages/home/news-feed/news-feed';
import { LANG } from '@/lib/env';

export const getStaticProps: GetStaticProps<Props> = async () => {
  const documents = { en: await getAllDocuments(`en`), es: await getAllDocuments(`es`) };
  let featuredBooks = [
    documents.en[`compilations/truth-in-the-inward-parts-v1`],
    documents.en[`hugh-turford/walk-in-the-spirit`],
    documents.en[`isaac-penington/writings-volume-1`],
    documents.en[`isaac-penington/writings-volume-2`],
    documents.en[`william-penn/no-cross-no-crown`],
    documents.en[`william-sewel/history-of-quakers`],
  ] as DocumentWithMeta[];
  if (LANG === `es`) {
    featuredBooks = [];
  }
  const newsFeedItems = await getNewsFeedItems(LANG, {
    en: Object.values(documents.en),
    es: Object.values(documents.es),
  });

  return {
    props: {
      featuredBooks,
      newsFeedItems,
    },
  };
};

interface Props {
  featuredBooks: DocumentWithMeta[];
  newsFeedItems: FeedItem[];
}

const Home: React.FC<Props> = ({ featuredBooks, newsFeedItems }) => (
  <main className="overflow-hidden">
    <HeroBlock />
    <SubHeroBlock numTotalBooks={0} />
    <NewsFeedBlock items={newsFeedItems} />
    <FeaturedBooksBlock books={featuredBooks} />
    <GettingStartedBlock />
    <WhoWereTheQuakersBlock />
    <FormatsBlock />
    <ExploreBooksBlock numTotalBooks={0} />
  </main>
);

export default Home;
