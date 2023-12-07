import React from 'react';
import cx from 'classnames';
import Link from 'next/link';
import { LANG } from '@/lib/env';
import AmigosLogo from '@/components/core/LogoAmigos';
import FriendsLogo from '@/components/core/LogoFriends';
import Dual from '@/components/core/Dual';

const AltSiteBlock: React.FC<{ numBooks: number; url: string }> = ({ numBooks, url }) => {
  const Logo = LANG === `en` ? AmigosLogo : FriendsLogo;
  return (
    <div
      className={cx(
        `AltSiteBlock p-16 text-white font-sans text-lg antialiased tracking-wide text-center leading-loose relative overflow-hidden`,
        {
          'bg-flgold': LANG === `en`,
          'bg-flmaroon': LANG === `es`,
        },
      )}
    >
      <Logo
        className="absolute opacity-[0.16] w-[800px] h-[300px] bottom-[-33%] left-[30%]"
        libraryColor="white"
        iconColor="white"
        friendsColor="white"
      />
      <Dual.H3 className="relative z-40">
        <>
          We also have {numBooks} books{` `}
          <Link href="/spanish-translations" className="subtle-link text-white">
            translated
          </Link>
          {` `}
          into Spanish! Switch to our{` `}
          <a className="fl-underline" href={url}>
            Spanish site here.
          </a>
        </>
        <>
          ¡También tenemos {numBooks} libros disponibles en inglés! Visita nuestro{` `}
          <a href={url} className="fl-underline">
            sitio en inglés aquí.
          </a>
        </>
      </Dual.H3>
    </div>
  );
};

export default AltSiteBlock;
