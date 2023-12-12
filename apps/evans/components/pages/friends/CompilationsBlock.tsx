import React from 'react';
import Link from 'next/link';
import { t } from '@friends-library/locale';
import NextBgImage from '@friends-library/next-bg-image';
import Dual from '@/components/core/Dual';
import Button from '@/components/core/Button';
import CompilationsBg from '@/public/images/village.jpg';

const CompilationsBlock: React.FC = () => (
  <NextBgImage
    src={[`linear-gradient(rgba(0, 0, 0, 0.38), rgba(0, 0, 0, 0.38))`, CompilationsBg]}
    className="text-center text-white px-8 py-24 md:py-24 xl:py-32"
    position={{ default: `center`, sm: `center 92%` }}
    size={{ default: `cover`, sm: `1500px` }}
  >
    <h1 className="sans-wider text-4xl font-bold">{t`Compilations`}</h1>
    <Dual.P className="body-text text-white py-8 text-lg leading-loose max-w-screen-sm mx-auto">
      <>
        We also have books that contain a collection of writings from several different
        authors. Some of these books were compiled and published by early Friends, and
        some were compiled more recently by the editors of this website. Among the latter
        group is the book{` `}
        <Link
          href="/compilations/truth-in-the-inward-parts-v1"
          className="subtle-link text-white"
        >
          Truth in the Inward Parts
        </Link>
        , a work containing extracts from the journals and letters of 10 early friends
        describing their discovery of truth and spiritual growth.
      </>
      <>
        También tenemos libros que son una compilación de escritos de varios autores
        diferentes. Algunos de estos libros fueron compilados y publicados por los
        primeros Amigos, y otros fueron compilados más recientemente por los editores de
        este sitio web. En este último grupo está incluido el libro{` `}
        <Link
          href="/compilaciones/verdad-en-lo-intimo"
          className="subtle-link text-white"
        >
          La Verdad en lo Íntimo
        </Link>
        , el cual contiene extractos de los diarios y cartas de 10 antiguos Amigos que
        describen su descubrimiento de la verdad y su crecimiento espiritual.
      </>
    </Dual.P>
    <Button to={t`/compilations`} className="mt-4 mx-auto">
      {t`View Compilations`} &rarr;
    </Button>
  </NextBgImage>
);

export default CompilationsBlock;
