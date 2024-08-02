import React from 'react';
import NextBgImage, { bgColor } from 'next-bg-image';
import { t } from '@friends-library/locale';
import Dual from '../core/Dual';
import Button from '../core/Button';
import { LANG } from '@/lib/env';
import SheepBg from '@/public/images/sheep.jpg';

const NotFoundHeroBlock: React.FC = () => (
  <NextBgImage
    eager
    className="text-center text-white px-10 py-20 sm:px-16 sm:py-24 md:py-24 xl:py-32"
    src={[bgColor(`rgba(0, 0, 0, 0.38)`), SheepBg, bgColor(`rgba(64, 40, 13, 1)`)]}
    position={{ base: `center`, 500: `center 80%` }}
    size={{ base: `cover`, 500: `1500px`, xl: `cover` }}
  >
    <h1 className="sans-wider text-4xl font-bold">{t`Not Found`}</h1>
    <Dual.P className="body-text text-white py-8 text-lg leading-loose max-w-screen-sm mx-auto">
      <>
        Sorry, it looks like you followed a broken link, or tried a URL that doesn’t
        exist. Try searching below for what you’re looking for, or you can contact us if
        you believe you’ve found a problem with the website &mdash; we’d love to know
        about it so we can fix it as soon as possible!
      </>
      <>
        Lo sentimos, parece que has entrado en un enlace roto, o intentado abrir un URL
        que no existe. Trata de encontrar lo que estás buscando más abajo, o puedes
        contactarnos si crees que has encontrado un problema con el sitio web &mdash; ¡Nos
        encantaría saberlo para poder solucionarlo lo antes posible!
      </>
    </Dual.P>
    <form
      action="https://google.com/search"
      className="flex flex-col md:flex-row p-3 sm:p-8 max-w-screen-md rounded-2xl mx-auto bg-black/50"
    >
      <input
        type="hidden"
        name="sitesearch"
        value={LANG === `en` ? `friendslibrary.com` : `bibliotecadelosamigos.org`}
      />
      <input
        className="subtle-focus flex-grow h-12 mb-4 md:mb-0 md:h-auto md:mr-6 rounded-md body-text px-8 text-xl bg-white/75"
        type="text"
        name="q"
        autoFocus
      />
      <Button className="mx-auto">{t`Search`}</Button>
    </form>
  </NextBgImage>
);

export default NotFoundHeroBlock;
