import React from 'react';
import { t, setLocale } from '@friends-library/locale';
import { ThreeD } from '@friends-library/cover-component';
import coverPropsMap from './cover-props';
import CoverCss from './CoverCss';
import { htmlTitle } from './helpers';
import LogoAmigos from '@/components/core/LogoAmigos';
import LogoFriends from '@/components/core/LogoFriends';
import './CoverGeneral.css';

interface Props {
  editionPath: string;
  volNum: number;
  numVols: number;
}

const CoverGeneral: React.FC<Props> = ({ editionPath, volNum, numVols }) => {
  const coverProps = coverPropsMap[editionPath];
  if (!coverProps) return null;
  const { lang, author, title, size } = coverProps;
  setLocale(lang);
  const Logo = lang === `en` ? LogoFriends : LogoAmigos;

  let scaler = 1.58;
  if (size === `m`) {
    scaler = 1.29;
  } else if (size === `xl`) {
    scaler = 1.21;
  }

  return (
    <div className={`CoverGeneral youtube-poster flex bg-flgray-400 ${lang}`}>
      <CoverCss scaler={scaler} scope={SCOPE} />
      <div className="ml-24 flex items-center justify-center">
        <ThreeD shadow {...coverProps} scaler={scaler} scope={SCOPE} />
      </div>
      <div className="flex-grow p-32 pl-0 flex flex-col space-y-20 items-center justify-center text-center">
        <h1
          className={`serif text-8xl text-fl${lang === `en` ? `maroon` : `maroon`}`}
          style={{ lineHeight: `150%` }}
          dangerouslySetInnerHTML={{ __html: htmlTitle(title, author) }}
        />
        {!author.startsWith(`Compila`) && (
          <h2 className="serif text-5xl text-gray-600 antialiased italic">
            {t`by`} {author}
          </h2>
        )}
        {numVols === 1 ? (
          <div className={`${lang === `en` ? `w-80` : `w-96`} pt-6`}>
            <Logo iconColor="white" friendsColor="white" libraryColor="white" />
          </div>
        ) : (
          <p className="rounded-full bg-flblue py-2 px-8 text-white sans text-3xl antialiased">
            Video {volNum} {lang === `en` ? `of` : `de`} {numVols}
          </p>
        )}
        <p className="sans text-3xl opacity-50 antialiased">
          {lang === `en` ? `www.friendslibrary.com` : `www.bibliotecadelosamigos.org`}
        </p>
      </div>
    </div>
  );
};

export default CoverGeneral;

const SCOPE = `cover-general-component`;
