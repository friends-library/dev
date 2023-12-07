import React from 'react';
import cx from 'classnames';
import type { Lang } from '@friends-library/types';
import coverPropsMap from './cover-props';
import CoverCss from './CoverCss';
import Album from '@/components/core/Album';
import EsSplash from '@/public/images/app/app-splash.es.jpg';
import EsAudio from '@/public/images/app/app-audio.es.jpg';
import EsList from '@/public/images/app/app-audio-list.es.jpg';
import EnSplash from '@/public/images/app/app-splash.en.jpg';
import EnAudio from '@/public/images/app/app-audio.en.jpg';
import EnList from '@/public/images/app/app-audio-list.en.jpg';
import './AppTease.css';

interface Props {
  lang: Lang;
  editionPath: string;
}

const AppTease: React.FC<Props> = ({ lang, editionPath }) => {
  const coverProps = coverPropsMap[editionPath];
  if (!coverProps) throw new Error(`missing cover props for ${editionPath}`);
  return (
    <div className="AppTease youtube-poster bg-white flex flex-col items-center overflow-hidden justify-between">
      <div className="AlbumWrap absolute z-10">
        <Album
          scaler={1}
          scope="custom-1"
          title={coverProps.title}
          editionType={coverProps.edition}
          isbn={coverProps.isbn}
          isCompilation={coverProps.isCompilation}
          friendName={coverProps.author}
          customCss={coverProps.customCss}
          customHtml={coverProps.customHtml}
        />
      </div>
      <CoverCss scaler={1} scope="custom-1" />
      <div
        className="text-center flex flex-col self-stretch px-2"
        style={{ transform: `translateY(100px)` }}
      >
        <div className="space-y-16">
          <h1 className="sans font-bold tracking-wide text-6xl">
            {lang === `en` ? `Listen on the go!` : `¡Escucha en cualquier momento!`}
          </h1>
          {lang === `en` ? (
            <p className="serif text-4xl px-16 leading-relaxed text-gray-500 antialiased">
              Listen to <em>this book</em> or any other of our early Quaker audiobooks
              from your <b className="text-black">iOS</b> or{` `}
              <b className="text-black">Android</b> device.
              <br />
              Visit our website at{` `}
              <span className={cx(`sans font-bold tracking-wide text-flmaroon`)}>
                www.friendslibrary.com
              </span>
              {` `}
              or search for &ldquo;Friends Library&rdquo; in the App Store.
            </p>
          ) : (
            <p className="serif text-4xl px-16 leading-relaxed text-gray-500 antialiased">
              Escucha <em>este libro</em> o cualquier otro de nuestros audiolibros de los
              primeros Cuáqueros desde tu dispositivo <b className="text-black">iOS</b> o
              {` `}
              <b className="text-black">Android</b>.
              <br />
              Visita nuestro sitio web{` `}
              <span className={cx(`sans font-bold tracking-wide text-flgold`)}>
                www.bibliotecadelosamigos.org
              </span>
              {` `}o busca “Biblioteca de Los Amigos” en la App Store.
            </p>
          )}
        </div>
      </div>
      <div className="flex space-x-16" style={{ transform: `translateY(185px)` }}>
        <img
          alt=""
          style={{ width: `30rem` }}
          className="w-96"
          src={lang === `en` ? EnSplash : EsSplash}
        />
        <img
          alt=""
          style={{ width: `30rem` }}
          className="w-96"
          src={lang === `en` ? EnAudio : EsAudio}
        />
        <img
          alt=""
          style={{ width: `30rem` }}
          className="w-96"
          src={lang === `en` ? EnList : EsList}
        />
      </div>
    </div>
  );
};

export default AppTease;
