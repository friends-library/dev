import React from 'react';
import { t } from '@friends-library/locale';
import NextBgImage from 'next-bg-image';
import Heading from '@/components/core/Heading';
import Dual from '@/components/core/Dual';
import Button from '@/components/core/Button';
import BgImage from '@/public/images/explore-books.jpg';

const ExploreBooksBlock: React.FC<{ numTotalBooks: number }> = ({ numTotalBooks }) => (
  <NextBgImage
    lazyLoad
    className="px-10 sm:px-16 py-20 sm:py-32 md:px-32"
    src={[`radial-gradient(rgba(0, 0, 0, 0.68), rgba(0, 0, 0, 0.925) 75%)`, BgImage]}
  >
    <Heading darkBg className="text-white">
      <Dual.Frag>
        <>Explore Books</>
        <>Explorar Libros</>
      </Dual.Frag>
    </Heading>
    <Dual.P className="font-serif text-white text-xl opacity-75 leading-loose max-w-3xl text-center mx-auto">
      <>
        We currently have {numTotalBooks} books available for free on this site. On our
        “Explore” page you can browse all the titles by edition, region, time period,
        tags, and more, or search the full library to find exactly what you’re looking
        for.
      </>
      <>
        Actualmente tenemos {numTotalBooks} libros disponibles de forma gratuita en este
        sitio, y se están traduciendo y añadiendo más regularmente. En nuestra página de
        “Explorar” puedes navegar a través de todos nuestros libros y audiolibros, o
        buscar libros en la categoría particular que más te interese.
      </>
    </Dual.P>
    <Button to={t`/explore`} className="mx-auto mt-12" shadow>
      <Dual.Frag>
        <>Start Exploring</>
        <>Comenzar a Explorar</>
      </Dual.Frag>
    </Button>
  </NextBgImage>
);

export default ExploreBooksBlock;
