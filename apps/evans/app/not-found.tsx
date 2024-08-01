import React from 'react';
import { t } from '@friends-library/locale';
import type { NextPage } from 'next';
import ExploreAltSiteBlock from '@/app/explore/AltSiteBlock';
import ExploreBooksBlock from '@/app/(home)/ExploreBooksBlock';
import HomeGettingStartedBlock from '@/app/(home)/GettingStartedBlock';
import api from '@/lib/ssg/api-client';
import NotFoundHeroBlock from '@/components/404/NotFoundHeroBlock';
import { APP_ALT_URL, LANG } from '@/lib/env';
import * as seo from '@/lib/seo';

interface PageData {
  numTotalBooks: number;
  numAlternateLanguageBooks: number;
}

async function getPageData(): Promise<PageData> {
  const data = await api.totalPublished();
  return {
    numTotalBooks: data.books[LANG],
    numAlternateLanguageBooks: data.books[LANG === `en` ? `es` : `en`],
  };
}

const Page: NextPage = async () => {
  const data = await getPageData();
  return (
    <div>
      <NotFoundHeroBlock />
      <HomeGettingStartedBlock />
      <ExploreAltSiteBlock url={APP_ALT_URL} numBooks={data.numAlternateLanguageBooks} />
      <ExploreBooksBlock numTotalBooks={data.numTotalBooks} />
    </div>
  );
};

export default Page;

export const metadata = seo.nextMetadata(t`Not Found`, seo.pageMetaDesc(`not-found`, {}));
