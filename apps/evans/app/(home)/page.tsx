import React from 'react';
import { t } from '@friends-library/locale';
import type { NextPage, Metadata } from 'next';
import type { FeedItem } from './news-feed/news-feed';
import { getNewsFeedItems } from './news-feed/news-feed';
import FeaturedBooksBlock from './FeaturedBooksBlock';
import HeroBlock from './HeroBlock';
import SubHeroBlock from './SubHeroBlock';
import GettingStartedBlock from './GettingStartedBlock';
import WhoWereTheQuakersBlock from './WhoWereTheQuakersBlock';
import FormatsBlock from './FormatsBlock';
import ExploreBooksBlock from './ExploreBooksBlock';
import NewsFeedBlock from './news-feed/NewsFeedBlock';
import NarrowPathSignupBlock from './NarrowPathSignupBlock';
import { LANG } from '@/lib/env';
import * as custom from '@/lib/ssg/custom-code';
import api, { type Api } from '@/lib/ssg/api-client';
import sendSearchDataToAlgolia from '@/lib/ssg/algolia';
import * as seo from '@/lib/seo';

async function getPageData(): Promise<Props> {
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
  return props;
}

interface Props {
  featuredBooks: Api.HomepageFeaturedBooks.Output;
  newsFeedItems: FeedItem[];
  numTotalBooks: number;
}

const Page: NextPage = async () => {
  const { featuredBooks, newsFeedItems, numTotalBooks } = await getPageData();
  return (
    <main className="overflow-hidden">
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
};

export default Page;

export async function generateMetadata(): Promise<Metadata> {
  const { numTotalBooks } = await getPageData();
  return seo.nextMetadata(
    t`Friends Library`,
    seo.pageMetaDesc(`home`, { numBooks: numTotalBooks }),
  );
}

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
