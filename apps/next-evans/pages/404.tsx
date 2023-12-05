import React from 'react';
import type { GetStaticProps } from 'next';
import api from '@/lib/ssg/api-client';
import HomeGettingStartedBlock from '@/components/pages/home/GettingStartedBlock';
import ExploreAltSiteBlock from '@/components/pages/explore/AltSiteBlock';
import ExploreBooksBlock from '@/components/pages/home/ExploreBooksBlock';
import NotFoundHeroBlock from '@/components/404/NotFoundHeroBlock';
import { LANG } from '@/lib/env';

interface Props {
  numTotalBooks: number;
  numAlternateLanguageBooks: number;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await api.totalPublished();
  return {
    props: {
      numTotalBooks: data.books[LANG],
      numAlternateLanguageBooks: data.books[LANG === `en` ? `es` : `en`],
    },
  };
};

const NotFoundPage: React.FC<Props> = ({ numTotalBooks, numAlternateLanguageBooks }) => (
  <div>
    <NotFoundHeroBlock />
    <HomeGettingStartedBlock />
    <ExploreAltSiteBlock
      url={
        LANG === `en` ? `https://bibliotecadelosamigos.org` : `https://friendslibrary.com`
      }
      numBooks={numAlternateLanguageBooks}
    />
    <ExploreBooksBlock numTotalBooks={numTotalBooks} />
  </div>
);

export default NotFoundPage;
