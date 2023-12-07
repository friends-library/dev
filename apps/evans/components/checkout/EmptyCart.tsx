import React, { useContext } from 'react';
import cx from 'classnames';
import { t } from '@friends-library/locale';
import Link from 'next/link';
import Header from './Header';
import Dual from '@/components/core/Dual';
import Button from '@/components/core/Button';
import { LANG } from '@/lib/env';
import { AppDispatch } from '@/lib/app-state';

const EmptyCart: React.FC = () => {
  const dispatch = useContext(AppDispatch);
  return (
    <div>
      <Header>
        <Dual.Frag>
          <>Empty Cart</>
          <>Tu carrito está vacío</>
        </Dual.Frag>
      </Header>
      <Dual.P className="body-text text-center">
        <>
          There’s nothing in your cart! Below are a few recommendations, or you can check
          out our{` `}
          <Link href={t`/getting-started`} className="subtle-link">
            getting started picks
          </Link>
          , or{` `}
          <Link href={t`/explore`} className="subtle-link">
            explore all the books
          </Link>
          .
        </>
        <>
          ¡No hay nada en tu carrito! Abajo encontrarás algunas recomendaciones, también
          puedes ver nuestra{` `}
          <Link href={t`/getting-started`} className="subtle-link">
            selección de libros para comenzar
          </Link>
          , o{` `}
          <Link href={t`/explore`} className="subtle-link">
            explorar todos nuestros libros
          </Link>
          .
        </>
      </Dual.P>
      <div className="flex flex-col items-center md:flex-row md:justify-center md:items-stretch md:gap-4 mt-8 px-6">
        {recommendedBooks[LANG].map(({ urlPath, title }, idx) => (
          <Link
            href={`/${urlPath}`}
            key={urlPath}
            onClick={() => setTimeout(() => dispatch({ type: `show--app` }), 250)}
            className={cx(
              `flex flex-col bg-[#efefef] w-[240px] p-4 rounded-lg items-center hover:underline mb-6 md:flex md:w-1/3`,
              {
                hidden: idx > 1,
              },
            )}
          >
            <img
              src={`https://flp-assets.nyc3.digitaloceanspaces.com/${LANG}/${urlPath}/updated/images/cover-3d--w250.png`}
              alt={title}
              className="h-[180px] md:h-[230px]"
            />
            <h3
              className="font-sans text-center mt-4 text-lg text-gray-800 tracking-wide"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </Link>
        ))}
      </div>
      <Button to={t`/explore`} className="mx-auto mt-4" shadow>
        {t`Explore Books`}
      </Button>
    </div>
  );
};

export default EmptyCart;

const recommendedBooks = {
  en: [
    {
      title: `Truth in the Inward Parts`,
      urlPath: `compilations/truth-in-the-inward-parts-v1`,
    },
    {
      title: `Walk in the Spirit`,
      urlPath: `hugh-turford/walk-in-the-spirit`,
    },
    {
      title: `The Writings of Isaac Penington`,
      urlPath: `isaac-penington/writings-volume-1`,
    },
  ],
  es: [
    {
      title: `La Verdad en Lo Íntimo`,
      urlPath: `compilaciones/verdad-en-lo-intimo-v1`,
    },
    {
      title: `Los Escritos de Isaac Penington`,
      urlPath: `isaac-penington/escritos-volumen-1`,
    },
    {
      title: `No Cruz, No Corona`,
      urlPath: `william-penn/no-cruz-no-corona`,
    },
  ],
};
