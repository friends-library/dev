import React from 'react';
import Link from 'next/link';
import { t } from '@friends-library/locale';
import NextBgImage from 'next-bg-image';
import Dual from '@/components/core/Dual';
import BgImg from '@/public/images/books-straight.jpg';
import { bgLayer } from '@/lib/color';

const GettingStartedLinkBlock: React.FC = () => (
  <NextBgImage
    className="p-16 bg-cover sm:p-20 md:p-24"
    src={[bgLayer(`flblue`, 0.8), BgImg]}
  >
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
  </NextBgImage>
);

export default GettingStartedLinkBlock;
