import React from 'react';
import { t } from '@friends-library/locale';
import BackgroundImage from '@/components/core/BackgroundImage';
import Dual from '@/components/core/Dual';
import { makeScroller } from '@/lib/scroll';
import HeroBg from '@/public/images/street.jpg';

interface Props {
  numFriends: number;
}

const FriendsPageHero: React.FC<Props> = ({ numFriends }) => (
  <BackgroundImage
    src={HeroBg}
    fit="cover"
    position="[object-position:center_88%]"
    className="text-center text-white"
  >
    <div className="bg-gradient-to-b from-black/40 to-black/60 px-16 py-16 md:py-24 xl:py-32">
      <h1 className="sans-wider text-4xl font-bold">{t`Authors`}</h1>
      <Dual.P className="body-text text-white py-8 text-lg leading-loose max-w-screen-sm mx-auto">
        <>
          Friends Library currently contains books written by{` `}
          <span className="font-bold">{numFriends}</span> early Friends, and more authors
          are being added regularly. Check out our recently-added authors, or browse the
          full list below. You can also{` `}
          <a
            href="#ControlsBlock"
            className="underline"
            onClick={(e) => {
              e.preventDefault();
              makeScroller(`#ControlsBlock`)();
            }}
          >
            sort
          </a>
          {` `}
          and{` `}
          <a
            href="#ControlsBlock"
            className="underline"
            onClick={(e) => {
              e.preventDefault();
              makeScroller(`#ControlsBlock`)();
            }}
          >
            search
          </a>
          {` `}
          to find exactly who you&rsquo;re looking for.
        </>
        <>
          Actualmente la Biblioteca de Amigos contiene libros escritos por{` `}
          <span className="font-bold">{numFriends}</span> antiguos Amigos, y
          constantemente estamos añadiendo nuevos autores. Dale un vistazo a nuestra
          sección, “Autores Añadidos Recientemente,” o explora la lista completa que está
          a continuación. También puedes utilizar las herramientas{` `}
          <a
            href="#ControlsBlock"
            className="underline"
            onClick={(e) => {
              e.preventDefault();
              makeScroller(`#ControlsBlock`)();
            }}
          >
            ordenar
          </a>
          {` `}y{` `}
          <a
            href="#ControlsBlock"
            className="underline"
            onClick={(e) => {
              e.preventDefault();
              makeScroller(`#ControlsBlock`)();
            }}
          >
            buscar
          </a>
          {` `}
          para hallar exactamente lo que estás buscando.
        </>
      </Dual.P>
    </div>
  </BackgroundImage>
);

export default FriendsPageHero;
