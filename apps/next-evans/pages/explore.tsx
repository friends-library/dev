import React from 'react';
import type { GetStaticProps } from 'next';
import type { DocumentWithFriendMeta } from '@/lib/types';
import BackgroundImage from '@/components/core/BackgroundImage';
import Dual from '@/components/core/Dual';
import HeroImg from '@/public/images/explore-books.jpg';
import NavBlock from '@/components/pages/explore/NavBlock';
import UpdatedEditionsBlock from '@/components/pages/explore/UpdatedEditionsBlock';
import { LANG } from '@/lib/env';
import GettingStartedLinkBlock from '@/components/pages/explore/GettingStartedLinkBlock';
import AudioBooksBlock from '@/components/pages/explore/AudioBooksBlock';
import NewBooksBlock from '@/components/pages/explore/NewBooksBlock';
import ExploreRegionsBlock from '@/components/pages/explore/RegionBlock';
import TimelineBlock from '@/components/pages/explore/TimelineBlock';
import AltSiteBlock from '@/components/pages/explore/AltSiteBlock';
import { getAllDocuments } from '@/lib/db/friends';
import { mostModernEdition } from '@/lib/editions';
import SearchBlock from '@/components/pages/explore/SearchBlock';

export const getStaticProps: GetStaticProps<Props> = async () => {
  const documents = Object.values(await getAllDocuments());
  return {
    props: {
      books: documents,
      numBooks: documents.length,
    },
  };
};

interface Props {
  numBooks: number;
  books: Array<DocumentWithFriendMeta>;
}

const ExploreBooks: React.FC<Props> = ({ numBooks, books }) => (
  <div>
    <BackgroundImage src={HeroImg} fineTuneImageStyles={{ objectFit: `cover` }}>
      <div className="p-8 sm:p-16 lg:p-24 bg-black/60 lg:backdrop-blur-sm">
        <WhiteOverlay>
          <Dual.H1 className="sans-wider text-3xl mb-6">
            <>Explore Books</>
            <>Explorar Libros</>
          </Dual.H1>
          <Dual.P className="body-text">
            <>
              We currently have {numBooks} books freely available on this site.
              Overwhelmed? On this page you can browse all the titles by edition, region,
              time period, tags, and more&mdash;or search the full library to find exactly
              what you’re looking for.
            </>
            <>
              Actualmente tenemos {numBooks} libros disponibles de forma gratuita en este
              sitio, y más están siendo traducidos y añadidos regularmente. En nuestra
              página de “Explorar” puedes navegar por todos nuestros libros y audiolibros,
              o buscar libros en la categoría particular que más te interese.
            </>
          </Dual.P>
        </WhiteOverlay>
      </div>
    </BackgroundImage>
    <NavBlock />
    <UpdatedEditionsBlock
      books={books.filter((book) => mostModernEdition(book.editionTypes) === `updated`)}
    />
    <GettingStartedLinkBlock />
    <AudioBooksBlock books={books.filter((book) => book.hasAudio)} />
    <NewBooksBlock
      books={books
        .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        .slice(0, 4)
        .map((book) => ({ ...book, audioDuration: undefined }))}
    />
    {LANG === `en` && (
      <ExploreRegionsBlock
        // TODO ~ get real region
        books={books.map((book) => ({
          ...book,
          region: `Western US`,
        }))}
      />
    )}
    {LANG === `en` && (
      // TODO ~ get real publication date
      <TimelineBlock books={books.map((book) => ({ ...book, date: 1700 }))} />
    )}
    <AltSiteBlock
      // TODO ~ get real book count
      numBooks={7}
      url={
        LANG === `en` ? `https://bibliotecadelosamigos.org` : `https://friendslibrary.com`
      }
    />
    <SearchBlock
      books={books.map((book) => ({
        ...book,
        edition: mostModernEdition(book.editionTypes),
        region: `England`,
        period: `early`,
      }))}
    />
  </div>
);

export default ExploreBooks;

export const WhiteOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white text-center py-12 md:py-16 lg:py-20 px-10 sm:px-16 my-6 max-w-screen-md mx-auto">
    {children}
  </div>
);
