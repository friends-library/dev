import React from 'react';
import Link from 'next/link';
import { t } from '@friends-library/locale';
import BackgroundImage from '@/components/core/BackgroundImage';
import Dual from '@/components/core/Dual';
import BgImg from '@/public/images/books-straight.jpg';

const GettingStartedLinkBlock: React.FC = () => (
  <BackgroundImage src={BgImg} fit="cover">
    <div className="bg-flblue/80 p-16 bg-cover sm:p-20 md:p-24">
      <Dual.H3 className="text-white text-center font-sans leading-loose tracking-wider text-lg antialiased">
        <>
          Looking for just a few hand-picked recommendations? Head on over to our{` `}
          <Link className="fl-underline" href={t`/getting-started`}>
            getting started
          </Link>
          {` `}
          page!
        </>
        <>
          ¿Estás buscando solo algunas recomendaciones escogidas? Haz clic aquí para ver
          {` `}
          <Link className="fl-underline" href={t`/getting-started`}>
            cómo comenzar
          </Link>
          .
        </>
      </Dual.H3>
    </div>
  </BackgroundImage>
);

export default GettingStartedLinkBlock;
