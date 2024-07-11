import React from 'react';
import { t } from '@friends-library/locale';
import type { GetStaticProps } from 'next';
import type { FeedItem } from '@/components/pages/home/news-feed/news-feed';
import { getNewsFeedItems } from '@/components/pages/home/news-feed/news-feed';
import FeaturedBooksBlock from '@/components/pages/home/FeaturedBooksBlock';
import HeroBlock from '@/components/pages/home/HeroBlock';
import SubHeroBlock from '@/components/pages/home/SubHeroBlock';
import GettingStartedBlock from '@/components/pages/home/GettingStartedBlock';
import WhoWereTheQuakersBlock from '@/components/pages/home/WhoWereTheQuakersBlock';
import FormatsBlock from '@/components/pages/home/FormatsBlock';
import ExploreBooksBlock from '@/components/pages/home/ExploreBooksBlock';
import NewsFeedBlock from '@/components/pages/home/news-feed/NewsFeedBlock';
import NarrowPathSignupBlock from '@/components/pages/home/NarrowPathSignupBlock';
import { LANG } from '@/lib/env';
import Seo, { pageMetaDesc } from '@/components/core/Seo';
import * as custom from '@/lib/ssg/custom-code';
import api, { type Api } from '@/lib/ssg/api-client';
import sendSearchDataToAlgolia from '@/lib/ssg/algolia';

export const getStaticProps: GetStaticProps<Props> = async () => {
  const props = await Promise.all([
    api.homepageFeaturedBooks({ lang: LANG, slugs: featuredBooks[LANG] }),
    api.newsFeedItems(LANG),
    api.totalPublished(),
    custom.some(featuredBooks[LANG]),
  ]).then(([featuredBooks, newsFeedItems, totalPublished, customCode]) => ({
    featuredBooks: featuredBooks.map(
      custom.merging(customCode, (book) => [book.friendSlug, book.documentSlug]),
    ),
    newsFeedItems: getNewsFeedItems(newsFeedItems),
    numTotalBooks: totalPublished.books[LANG],
  }));
  if (process.env.VERCEL_ENV === `production`) {
    await sendSearchDataToAlgolia();
  }
  return { props };
};

interface Props {
  featuredBooks: Api.HomepageFeaturedBooks.Output;
  newsFeedItems: FeedItem[];
  numTotalBooks: number;
}

const Home: React.FC<Props> = ({ featuredBooks, newsFeedItems, numTotalBooks }) => (
  <main className="overflow-hidden">
    <Seo
      title={t`Friends Library`}
      description={pageMetaDesc(`home`, { numBooks: numTotalBooks })}
    />
    <HeroBlock />
    <SubHeroBlock numTotalBooks={numTotalBooks} />
    <NewsFeedBlock items={newsFeedItems} />
    <FeaturedBooksBlock books={featuredBooks} />
    <GettingStartedBlock />
    <NarrowPathSignupBlock />
    <WhoWereTheQuakersBlock />
    <FormatsBlock />
    <ExploreBooksBlock numTotalBooks={numTotalBooks} />
  </main>
);

export default Home;

// helpers

const featuredBooks = {
  en: [
    { friendSlug: `compilations`, documentSlug: `truth-in-the-inward-parts-v1` },
    { friendSlug: `hugh-turford`, documentSlug: `walk-in-the-spirit` },
    { friendSlug: `isaac-penington`, documentSlug: `writings-volume-1` },
    { friendSlug: `isaac-penington`, documentSlug: `writings-volume-2` },
    { friendSlug: `william-penn`, documentSlug: `no-cross-no-crown` },
    { friendSlug: `william-sewel`, documentSlug: `history-of-quakers` },
  ],
  es: [
    { friendSlug: `isaac-penington`, documentSlug: `escritos-volumen-1` },
    { friendSlug: `isaac-penington`, documentSlug: `escritos-volumen-2` },
    { friendSlug: `william-penn`, documentSlug: `no-cruz-no-corona` },
  ],
};
